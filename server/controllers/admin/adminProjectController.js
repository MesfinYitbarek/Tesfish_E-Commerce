// controllers/admin/adminProjectController.js
import { validationResult } from "express-validator";
import slugify from "slugify";
import Project from "../../models/Project.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/upload/cloudinaryService.js";

// @desc    Get all projects for admin
// @route   GET /api/admin/projects
// @access  Private (Admin only)
export const getProjectsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'client.name': { $regex: req.query.search, $options: 'i' } },
        { 'location.city': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query['timeline.startDate'] = {};
      if (req.query.startDate) {
        query['timeline.startDate'].$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query['timeline.startDate'].$lte = new Date(req.query.endDate);
      }
    }

    // Budget range filter
    if (req.query.minBudget || req.query.maxBudget) {
      query['budget.amount'] = {};
      if (req.query.minBudget) {
        query['budget.amount'].$gte = Number(req.query.minBudget);
      }
      if (req.query.maxBudget) {
        query['budget.amount'].$lte = Number(req.query.maxBudget);
      }
    }

    // Featured filter
    if (req.query.featured) {
      query['displaySettings.isFeatured'] = req.query.featured === 'true';
    }

    // Public filter
    if (req.query.public) {
      query['displaySettings.isPublic'] = req.query.public === 'true';
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case 'budget-low':
        sort = { 'budget.amount': 1 };
        break;
      case 'budget-high':
        sort = { 'budget.amount': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'title':
        sort = { title: 1 };
        break;
      case 'start-date':
        sort = { 'timeline.startDate': -1 };
        break;
      case 'progress':
        sort = { 'progress.percentage': -1 };
        break;
      case 'views':
        sort = { 'analytics.views': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Fetch projects
    const projects = await Project.find(query)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProjects: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        }
      },
    });
  } catch (error) {
    console.error("Get projects for admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching projects",
    });
  }
};

// @desc    Create new project
// @route   POST /api/admin/projects
// @access  Private (Admin only)
export const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Parse JSON fields
    const parsedFields = [
      'client', 'location', 'timeline', 'budget', 'progress', 
      'features', 'services', 'team', 'testimonial', 'displaySettings',
      'sustainability', 'awards', 'challenges'
    ];
    
    parsedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = req.body[field] ? JSON.parse(req.body[field]) : {};
        } catch (e) {
          console.warn(`Invalid JSON for ${field}:`, e.message);
          req.body[field] = {};
        }
      }
    });

    // Build project data
    const projectData = {
      ...req.body,
      createdBy: req.user.id,
      slug: slugify(req.body.title, { lower: true, strict: true }),
    };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      try {
        const imagePromises = req.files.map(async (file, index) => {
          const uploadResult = await uploadToCloudinary(file.path, "projects");
          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            alt: `${req.body.title} - Image ${index + 1}`,
            isPrimary: index === 0,
            category: 'gallery'
          };
        });
        
        projectData.media = projectData.media || {};
        projectData.media.images = await Promise.all(imagePromises);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload project images",
          error: uploadError.message
        });
      }
    }

    // Generate unique slug
    let slug = projectData.slug;
    let counter = 1;
    while (await Project.findOne({ slug })) {
      slug = `${projectData.slug}-${counter++}`;
    }
    projectData.slug = slug;

    // Create project
    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });

  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating project",
    });
  }
};

// @desc    Update project
// @route   PUT /api/admin/projects/:id
// @access  Private (Admin only)
export const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Parse JSON fields
    const parsedFields = [
      'client', 'location', 'timeline', 'budget', 'progress',
      'features', 'services', 'team', 'testimonial'
    ];
    
    parsedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = req.body[field] ? JSON.parse(req.body[field]) : {};
        } catch (e) {
          console.warn(`Invalid JSON for ${field}:`, e.message);
        }
      }
    });

    const updateData = { 
      ...req.body,
      updatedBy: req.user.id
    };

    // Update slug if title changed
    if (req.body.title && req.body.title !== project.title) {
      updateData.slug = slugify(req.body.title, { lower: true, strict: true });

      // Ensure unique slug
      let slug = updateData.slug;
      let counter = 1;
      while (await Project.findOne({ slug, _id: { $ne: project._id } })) {
        slug = `${updateData.slug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) =>
        uploadToCloudinary(file.path, "projects")
      );
      const uploadedImages = await Promise.all(imagePromises);

      const newImages = uploadedImages.map((img, index) => ({
        url: img.secure_url,
        publicId: img.public_id,
        alt: `${req.body.title || project.title} - Image ${index + 1}`,
        isPrimary: false,
        category: 'gallery'
      }));

      updateData.media = {
        ...project.media.toObject(),
        images: [...(project.media.images || []), ...newImages],
      };
    }

    project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating project",
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete images from cloudinary
    if (project.media.images && project.media.images.length > 0) {
      const deletePromises = project.media.images.map((img) => {
        if (img.publicId) {
          return deleteFromCloudinary(img.publicId);
        }
      });
      await Promise.all(deletePromises);
    }

    // Delete videos from cloudinary
    if (project.media.videos && project.media.videos.length > 0) {
      const deletePromises = project.media.videos.map((video) => {
        if (video.publicId) {
          return deleteFromCloudinary(video.publicId);
        }
      });
      await Promise.all(deletePromises);
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting project",
    });
  }
};

// @desc    Get project by ID
// @route   GET /api/admin/projects/:id
// @access  Private (Admin only)
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    console.error("Get project by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching project",
    });
  }
};

// @desc    Update project status
// @route   PUT /api/admin/projects/:id/status
// @access  Private (Admin only)
export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const oldStatus = project.status;
    project.status = status;
    project.updatedBy = req.user.id;

    // Auto-update progress and dates based on status
    if (status === 'completed') {
      project.progress.percentage = 100;
      project.timeline.completedDate = new Date();
    } else if (status === 'ongoing' && oldStatus === 'planning') {
      project.timeline.startDate = project.timeline.startDate || new Date();
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: `Project status updated from ${oldStatus} to ${status}`,
      data: { project },
    });
  } catch (error) {
    console.error("Update project status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating project status",
    });
  }
};

// @desc    Update project progress
// @route   PUT /api/admin/projects/:id/progress
// @access  Private (Admin only)
export const updateProjectProgress = async (req, res) => {
  try {
    const { percentage, milestones, phases } = req.body;
    
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (percentage !== undefined) {
      project.progress.percentage = Math.max(0, Math.min(100, percentage));
    }

    if (milestones) {
      project.progress.milestones = milestones;
    }

    if (phases) {
      project.progress.phases = phases;
    }

    project.updatedBy = req.user.id;

    // Auto-complete if 100%
    if (project.progress.percentage === 100 && project.status !== 'completed') {
      project.status = 'completed';
      project.timeline.completedDate = new Date();
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project progress updated successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Update project progress error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating project progress",
    });
  }
};

// @desc    Toggle featured status
// @route   PUT /api/admin/projects/:id/featured
// @access  Private (Admin only)
export const toggleFeaturedProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.displaySettings.isFeatured = !project.displaySettings.isFeatured;
    project.updatedBy = req.user.id;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.displaySettings.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: { project },
    });
  } catch (error) {
    console.error("Toggle featured project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating featured status",
    });
  }
};

// @desc    Duplicate project
// @route   POST /api/admin/projects/:id/duplicate
// @access  Private (Admin only)
export const duplicateProject = async (req, res) => {
  try {
    const originalProject = await Project.findById(req.params.id);

    if (!originalProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const projectData = originalProject.toObject();
    delete projectData._id;
    delete projectData.createdAt;
    delete projectData.updatedAt;
    delete projectData.__v;

    // Update title and slug
    projectData.title = `${projectData.title} (Copy)`;
    projectData.slug = slugify(projectData.title, { lower: true, strict: true });
    projectData.createdBy = req.user.id;
    projectData.updatedBy = req.user.id;

    // Reset status and progress
    projectData.status = 'planning';
    projectData.progress.percentage = 0;
    projectData.timeline.completedDate = null;
    projectData.analytics = {
      views: 0,
      shares: 0,
      inquiries: 0
    };

    // Ensure unique slug
    let slug = projectData.slug;
    let counter = 1;
    while (await Project.findOne({ slug })) {
      slug = `${projectData.slug}-${counter++}`;
    }
    projectData.slug = slug;

    const duplicatedProject = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project duplicated successfully",
      data: { project: duplicatedProject },
    });
  } catch (error) {
    console.error("Duplicate project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while duplicating project",
    });
  }
};

// @desc    Delete multiple projects
// @route   DELETE /api/admin/projects/bulk
// @access  Private (Admin only)
export const deleteMultipleProjects = async (req, res) => {
  try {
    const { projectIds } = req.body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide project IDs to delete",
      });
    }

    // Get projects to delete images
    const projects = await Project.find({ _id: { $in: projectIds } });

    // Delete images from cloudinary
    const deletePromises = [];
    projects.forEach(project => {
      if (project.media.images && project.media.images.length > 0) {
        project.media.images.forEach(img => {
          if (img.publicId) {
            deletePromises.push(deleteFromCloudinary(img.publicId));
          }
        });
      }
    });

    await Promise.all(deletePromises);

    // Delete projects
    const result = await Project.deleteMany({ _id: { $in: projectIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} projects deleted successfully`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("Delete multiple projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting projects",
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/admin/projects/stats
// @access  Private (Admin only)
export const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.getProjectStats();

    // Additional stats
    const additionalStats = await Project.aggregate([
      {
        $facet: {
          monthlyProjects: [
            {
              $group: {
                _id: {
                  year: { $year: '$timeline.startDate' },
                  month: { $month: '$timeline.startDate' }
                },
                count: { $sum: 1 },
                totalBudget: { $sum: '$budget.amount' }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
          ],
          topClients: [
            {
              $group: {
                _id: '$client.name',
                projects: { $sum: 1 },
                totalBudget: { $sum: '$budget.amount' }
              }
            },
            { $sort: { projects: -1 } },
            { $limit: 10 }
          ],
          recentProjects: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                title: 1,
                status: 1,
                'progress.percentage': 1,
                'budget.amount': 1,
                'timeline.startDate': 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats[0],
        ...additionalStats[0]
      }
    });
  } catch (error) {
    console.error("Get project stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching project statistics",
    });
  }
};

// @desc    Get project categories
// @route   GET /api/admin/projects/categories
// @access  Private (Admin only)
export const getProjectCategories = async (req, res) => {
  try {
    const categories = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgBudget: { $avg: '$budget.amount' },
          avgProgress: { $avg: '$progress.percentage' },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          ongoingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'ongoing'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error("Get project categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching project categories",
    });
  }
};