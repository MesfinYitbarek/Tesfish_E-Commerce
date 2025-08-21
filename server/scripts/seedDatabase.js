import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import ServiceInquiry from "../models/ServiceInquiry.js"
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected for seeding");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Sample data
const categories = [
  {
    name: "Real Estate",
    slug: "real-estate",
    description: "Properties for sale and rent",
    subcategories: [
      { name: "Apartments", slug: "apartments" },
      { name: "Villas", slug: "villas" },
      { name: "Commercial", slug: "commercial" },
      { name: "Land", slug: "land" },
    ],
  },
  {
    name: "Services",
    slug: "services",
    description: "Professional services",
    subcategories: [
      { name: "Construction", slug: "construction" },
      { name: "Interior Design", slug: "interior-design" },
      { name: "Engineering", slug: "engineering" },
      { name: "Consultancy", slug: "consultancy" },
    ],
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
  }, 
  {
    name: "Fashion", 
    slug: "fashion",
    description: "Clothing and accessories",
  },
];

const users = [
  {
    email: "admin@citilights.com",
    password: "admin123",
    userType: "admin",
    isVerified: true,
  },
  {
    email: "company@example.com",
    password: "company123",
    userType: "company",
    isVerified: true,
    companyProfile: {
      companyName: "Ethiopian Real Estate Co.",
      description: "Leading real estate company in Ethiopia",
      businessCategories: ["real-estate", "construction"],
      contactInfo: {
        phone: "+251911123456",
        email: "info@ethiopianrealestate.com",
      },
      address: {
        street: "123 Bole Road",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
    },
  },
  {
    email: "individual@example.com",
    password: "individual123",
    userType: "individual",
    isVerified: true,
    individualProfile: {
      firstName: "John",
      lastName: "Doe",
      phone: "+251911234567",
      address: {
        street: "456 Kazanchis",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
    },
  },
  {
    email: "customer@example.com",
    password: "customer123",
    userType: "customer",
    isVerified: true,
    customerProfile: {
      firstName: "Jane",
      lastName: "Smith",
      phone: "+251911345678",
      preferences: {
        categories: ["real-estate", "electronics"],
        budget: { min: 50000, max: 500000 },
      },
    },
  },
  {
    email: "servicecompany@example.com",
    password: "service123",
    userType: "company",
    isVerified: true,
    companyProfile: {
      companyName: "Addis Engineering Solutions",
      description: "Professional engineering and construction services",
      businessCategories: ["engineering", "construction", "services"],
      contactInfo: {
        phone: "+251911456789",
        email: "info@addisengineering.com",
      },
      address: {
        street: "789 Megenagna",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
    },
  },
  {
    email: "designer@example.com",
    password: "designer123",
    userType: "individual",
    isVerified: true,
    individualProfile: {
      firstName: "Sara",
      lastName: "Johnson",
      phone: "+251911567890",
      professionalTitle: "Interior Designer",
      address: {
        street: "321 CMC Road",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
    },
  },
];

// Seed functions
const seedCategories = async () => {
  try {
    await Category.deleteMany({});

    for (const categoryData of categories) {
      const { subcategories, ...mainCategory } = categoryData;
      const category = await Category.create(mainCategory);

      if (subcategories) {
        for (const subcat of subcategories) {
          await Category.create({
            ...subcat,
            parentCategory: category._id,
          });
        }
      }
    }

    console.log("✅ Categories seeded successfully");
  } catch (error) {
    console.error("❌ Categories seeding failed:", error);
    throw error;
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});

    // Create users without password hashing
    for (const userData of users) {
      await User.create(userData);
    }

    console.log("✅ Users seeded successfully");
  } catch (error) {
    console.error("❌ Users seeding failed:", error);
    throw error;
  }
};

const seedProducts = async () => {
  try {
    await Product.deleteMany({});

    const realEstateCategory = await Category.findOne({ slug: "real-estate" });
    const servicesCategory = await Category.findOne({ slug: "services" });
    
    if (!realEstateCategory || !servicesCategory) {
      throw new Error("Required categories not found in database");
    }

    const company = await User.findOne({ email: "company@example.com" });
    const individual = await User.findOne({ email: "individual@example.com" });
    const serviceCompany = await User.findOne({ email: "servicecompany@example.com" });
    const designer = await User.findOne({ email: "designer@example.com" });

    if (!company || !individual || !serviceCompany || !designer) {
      throw new Error("Required users not found in database");
    }

    const sampleProducts = [
      // Real estate products
      {
        title: "Luxury Villa in Bole",
        slug: "luxury-villa-in-bole",
        description: "Beautiful 4-bedroom villa with modern amenities",
        seller: company._id,
        sellerType: "company",
        category: realEstateCategory._id,
        productType: "real-estate",
        pricing: {
          basePrice: 8500000,
          currency: "ETB",
        },
        realEstateDetails: {
          propertyType: "villa",
          bedrooms: 4,
          bathrooms: 3,
          area: { value: 350, unit: "sqm" },
          location: {
            address: "Bole Sub City",
            city: "Addis Ababa",
            country: "Ethiopia",
          },
        },
        status: "active",
      },
      {
        title: "Modern Apartment in Kazanchis",
        slug: "modern-apartment-kazanchis",
        description: "Spacious 2-bedroom apartment with city view",
        seller: individual._id,
        sellerType: "individual",
        category: realEstateCategory._id,
        productType: "real-estate",
        pricing: {
          basePrice: 3200000,
          currency: "ETB",
        },
        realEstateDetails: {
          propertyType: "apartment",
          bedrooms: 2,
          bathrooms: 2,
          area: { value: 120, unit: "sqm" },
          location: {
            address: "Kazanchis Area",
            city: "Addis Ababa",
            country: "Ethiopia",
          },
        },
        status: "active",
      },
      // Service products
      {
        title: "Structural Engineering Consultation",
        slug: "structural-engineering-consultation",
        description: "Professional structural engineering services for residential and commercial buildings",
        seller: serviceCompany._id,
        sellerType: "company",
        category: servicesCategory._id,
        productType: "service",
        pricing: {
          basePrice: 15000,
          currency: "ETB",
          priceType: "per-hour"
        },
        serviceDetails: {
          serviceType: "engineering-design",
          duration: {
            value: 1,
            unit: "hours"
          },
          location: "on-site",
          requirements: [
            "Building plans",
            "Site details",
            "Project specifications"
          ]
        },
        status: "active",
      },
      {
        title: "Residential Construction Supervision",
        slug: "residential-construction-supervision",
        description: "Professional construction supervision for residential projects",
        seller: serviceCompany._id,
        sellerType: "company",
        category: servicesCategory._id,
        productType: "service",
        pricing: {
          basePrice: 50000,
          currency: "ETB",
          priceType: "per-month"
        },
        serviceDetails: {
          serviceType: "construction",
          duration: {
            value: 6,
            unit: "months"
          },
          location: "on-site",
          requirements: [
            "Construction contract",
            "Project timeline",
            "Budget details"
          ]
        },
        status: "active",
      },
      {
        title: "Modern Interior Design Package",
        slug: "modern-interior-design-package",
        description: "Complete interior design service including 3D visualization and material selection",
        seller: designer._id,
        sellerType: "individual",
        category: servicesCategory._id,
        productType: "service",
        pricing: {
          basePrice: 75000,
          currency: "ETB",
          priceType: "fixed"
        },
        serviceDetails: {
          serviceType: "interior-design",
          duration: {
            value: 4,
            unit: "weeks"
          },
          location: "hybrid",
          requirements: [
            "Room dimensions",
            "Style preferences",
            "Budget range"
          ]
        },
        status: "active",
      },
      {
        title: "Business Startup Consultancy",
        slug: "business-startup-consultancy",
        description: "Professional guidance for new business startups including legal and financial advice",
        seller: serviceCompany._id,
        sellerType: "company",
        category: servicesCategory._id,
        productType: "service",
        pricing: {
          basePrice: 25000,
          currency: "ETB",
          priceType: "fixed"
        },
        serviceDetails: {
          serviceType: "consultancy",
          duration: {
            value: 2,
            unit: "weeks"
          },
          location: "remote",
          requirements: [
            "Business idea",
            "Target market",
            "Initial capital"
          ]
        },
        status: "active",
      }
    ];

    for (const product of sampleProducts) {
      await Product.create(product);
    }

    console.log("✅ Products seeded successfully");
  } catch (error) {
    console.error("❌ Products seeding failed:", error);
    throw error;
  }
};

const seedNotifications = async () => {
  try {
    await Notification.deleteMany({});

    const customer = await User.findOne({ userType: "customer" });
    const company = await User.findOne({ userType: "company" });

    if (customer && company) {
      const sampleNotifications = [
        {
          recipient: customer._id,
          title: "Welcome to CitiLights!",
          message:
            "Thank you for joining our platform. Explore our amazing products and services.",
          type: "system",
          priority: "medium",
        },
        {
          recipient: company._id,
          title: "Complete Your Profile",
          message:
            "Add more details to your company profile to attract more customers.",
          type: "system",
          priority: "high",
        },
      ];

      await Notification.insertMany(sampleNotifications);
    }

    console.log("✅ Notifications seeded successfully");
  } catch (error) {
    console.error("❌ Notifications seeding failed:", error);
  }
};

const seedServiceInquiries = async () => {
  try {
    await ServiceInquiry.deleteMany({});

    const customer = await User.findOne({ userType: "customer" });
    const company = await User.findOne({ email: "servicecompany@example.com" });
    const designer = await User.findOne({ email: "designer@example.com" });

    if (customer && company && designer) {
      const sampleInquiries = [
        {
          customer: customer._id,
          serviceProvider: company._id,
          serviceType: "engineering-design",
          customerInfo: {
            firstName: customer.customerProfile.firstName,
            lastName: customer.customerProfile.lastName,
            email: customer.email,
            phone: customer.customerProfile.phone,
          },
          projectDetails: {
            title: "Residential Building Structural Design",
            description:
              "Need structural design for a 3-story residential building in Addis Ababa.",
            budget: { min: 50000, max: 150000, currency: "ETB" },
            timeline: {
              startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
              duration: "1 month",
            },
            location: "Bole, Addis Ababa",
            requirements: [
              "Structural calculations",
              "Detailed drawings",
              "Material specifications"
            ],
          },
          priority: "high",
        },
        {
          customer: customer._id,
          serviceProvider: designer._id,
          serviceType: "interior-design",
          customerInfo: {
            firstName: customer.customerProfile.firstName,
            lastName: customer.customerProfile.lastName,
            email: customer.email,
            phone: customer.customerProfile.phone,
          },
          projectDetails: {
            title: "Modern Apartment Interior Design",
            description:
              "Looking for contemporary interior design for a 120 sqm apartment in Kazanchis.",
            budget: { min: 30000, max: 80000, currency: "ETB" },
            timeline: {
              startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              duration: "3-4 weeks",
            },
            location: "Kazanchis, Addis Ababa",
            requirements: [
              "Modern Scandinavian style",
              "Space optimization",
              "3D renderings"
            ],
          },
          priority: "medium",
        }
      ];

      await ServiceInquiry.insertMany(sampleInquiries);
    }

    console.log("✅ Service Inquiries seeded successfully");
  } catch (error) {
    console.error("❌ Service Inquiries seeding failed:", error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting database seeding...");

    await seedCategories();
    await seedUsers();
    await seedProducts();
    await seedNotifications();
    await seedServiceInquiries();

    console.log("🎉 Database seeding completed successfully!");

    console.log("\n📝 Test Accounts:");
    console.log("Admin: admin@citilights.com / admin123");
    console.log("Real Estate Company: company@example.com / company123");
    console.log("Individual Seller: individual@example.com / individual123");
    console.log("Customer: customer@example.com / customer123");
    console.log("Engineering Service Company: servicecompany@example.com / service123");
    console.log("Interior Designer: designer@example.com / designer123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();