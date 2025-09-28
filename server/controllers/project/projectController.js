// controllers/projectController.js
import Project from '../../models/Project.js';

// @desc    Get public projects
// @route   GET /api/projects
// @access  Public
export const getPublicProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query for public projects only
    let query = {
      'displaySettings.isPublic': true,
      'displaySettings.showInPortfolio': true
    };

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Status filter
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'location.city': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case 'newest':
        sort = { 'timeline.startDate': -1 };
        break;
      case 'oldest':
        sort = { 'timeline.startDate': 1 };
        break;
      case 'budget-high':
        sort = { 'budget.amount': -1 };
        break;
      case 'budget-low':
        sort = { 'budget.amount': 1 };
        break;
      case 'popular':
        sort = { 'analytics.views': -1 };
        break;
      default:
        sort = { 'displaySettings.displayOrder': 1, 'timeline.startDate': -1 };
    }

    const projects = await Project.find(query)
      .select('-createdBy -updatedBy -analytics.shares -analytics.inquiries')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        }
      },
    });
  } catch (error) {
    console.error("Get public projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching projects",
    });
  }
};

// @desc    Get project by slug
// @route   GET /api/projects/:slug
// @access  Public
export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      'displaySettings.isPublic': true
    }).select('-createdBy -updatedBy');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Increment views if not the owner
    if (!req.user || req.user.id !== project.createdBy.toString()) {
      await project.incrementViews();
    }

    // Get related projects
    const relatedProjects = await Project.find({
      category: project.category,
      _id: { $ne: project._id },
      'displaySettings.isPublic': true,
      'displaySettings.showInPortfolio': true
    })
      .select('title slug description media.images category status timeline.duration budget.amount')
      .limit(4)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        project,
        relatedProjects
      },
    });
  } catch (error) {
    console.error("Get project by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching project",
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
export const getFeaturedProjects = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const projects = await Project.getFeaturedProjects(limit);

    res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    console.error("Get featured projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured projects",
    });
  }
};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
export const getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const projects = await Project.getProjectsByCategory(category, limit);

    res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    console.error("Get projects by category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching projects by category",
    });
  }
};

// @desc    Search projects
// @route   GET /api/projects/search
// @access  Public
export const searchProjects = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters long",
      });
    }

    const searchQuery = {
      'displaySettings.isPublic': true,
      'displaySettings.showInPortfolio': true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { longDescription: { $regex: q, $options: 'i' } },
        { 'client.name': { $regex: q, $options: 'i' } },
        { 'location.city': { $regex: q, $options: 'i' } },
        { features: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    const projects = await Project.find(searchQuery)
      .select('title slug description media.images category status timeline.duration budget.amount location.city')
      .sort({ 'analytics.views': -1, 'timeline.startDate': -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Project.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: {
        projects,
        query: q,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
        }
      },
    });
  } catch (error) {
    console.error("Search projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching projects",
    });
  }
};

// @desc    Increment project views
// @route   POST /api/projects/:slug/view
// @access  Public
export const incrementProjectViews = async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      'displaySettings.isPublic': true
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.incrementViews();

    res.status(200).json({
      success: true,
      message: "View recorded",
    });
  } catch (error) {
    console.error("Increment project views error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while recording view",
    });
  }
};