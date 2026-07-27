/* Initial Mock Dataset Seed */

export const INITIAL_MOCK_DATA = {
  student: {
    id: "STU-2026-8892",
    name: "Aditya Raj",
    email: "adityaraj@gmail.com",
    phone: "+1 (555) 234-5678",
    college: "Stanford Institute of Technology",
    department: "Computer Science & Artificial Intelligence",
    semester: "Semester 6",
    bio: "Passionate CS major interested in Full-Stack Web Architecture, Deep Learning, and SaaS Product Engineering.",
    learningGoal: "Master Advanced Distributed Systems & Cloud-Native Architectures before graduation.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    socialLinks: {
      github: "https://github.com/adityaraj",
      linkedin: "https://linkedin.com/in/adityaraj",
      twitter: "https://twitter.com/adityaraj_dev"
    }
  },

  stats: {
    coursesEnrolled: 6,
    coursesCompleted: 2,
    pendingAssignments: 3,
    overallAttendancePct: 92,
    averageGrade: "A",
    cgpa: 3.88,
    certificatesCount: 4,
    learningScore: 945
  },

  courses: [
    {
      id: "CRS-101",
      title: "Advanced Data Structures & Algorithms",
      instructor: "Dr. Robert Vance",
      category: "Computer Science",
      difficulty: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
      modulesCompleted: 9,
      totalModules: 12,
      progressPct: 75,
      status: "In Progress",
      estimatedCompletion: "Aug 15, 2026",
      isFavourite: true,
      description: "Master graph algorithms, dynamic programming, advanced tree structures, and algorithmic complexity evaluation.",
      modules: [
        { id: 1, title: "Module 1: Big-O Complexity & Memory Optimization", completed: true },
        { id: 2, title: "Module 2: Advanced Graph Traversal Algorithms", completed: true },
        { id: 3, title: "Module 3: Shortest Path & Minimum Spanning Trees", completed: true },
        { id: 4, title: "Module 4: Dynamic Programming Patterns", completed: true },
        { id: 5, title: "Module 5: Segment Trees & Fenwick Trees", completed: true },
        { id: 6, title: "Module 6: Disjoint Set Union & Kruskal Algorithm", completed: true },
        { id: 7, title: "Module 7: String Matching (KMP & Rabin-Karp)", completed: true },
        { id: 8, title: "Module 8: Network Flow & Max-Flow Algorithms", completed: true },
        { id: 9, title: "Module 9: NP-Completeness & Approximation", completed: true },
        { id: 10, title: "Module 10: Randomized Algorithms", completed: false },
        { id: 11, title: "Module 11: Computational Geometry", completed: false },
        { id: 12, title: "Module 12: Capstone Algorithmic Engine Project", completed: false }
      ]
    },
    {
      id: "CRS-102",
      title: "Modern Full-Stack SaaS Architecture",
      instructor: "Prof. Sarah Jenkins",
      category: "Web Engineering",
      difficulty: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
      modulesCompleted: 10,
      totalModules: 10,
      progressPct: 100,
      status: "Completed",
      estimatedCompletion: "Completed Jul 10, 2026",
      isFavourite: true,
      description: "Comprehensive guide to building scaleable multi-tenant SaaS applications, microservices, and REST API systems.",
      modules: [
        { id: 1, title: "Module 1: SaaS Architecture Fundamentals", completed: true },
        { id: 2, title: "Module 2: RESTful API Design & OpenAPI Specs", completed: true },
        { id: 3, title: "Module 3: Authentication, OAuth2 & JWT Security", completed: true },
        { id: 4, title: "Module 4: State Management & Client Caching", completed: true },
        { id: 5, title: "Module 5: Relational & NoSQL Database Modeling", completed: true },
        { id: 6, title: "Module 6: Microservices & Event-Driven Message Queues", completed: true },
        { id: 7, title: "Module 7: Stripe Billing Integration", completed: true },
        { id: 8, title: "Module 8: Serverless Computing & Edge Functions", completed: true },
        { id: 9, title: "Module 9: CI/CD Pipelines & Containerization", completed: true },
        { id: 10, title: "Module 10: Production SaaS Deployment", completed: true }
      ]
    },
    {
      id: "CRS-103",
      title: "Artificial Intelligence & Neural Networks",
      instructor: "Dr. Alan Turing",
      category: "Artificial Intelligence",
      difficulty: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
      modulesCompleted: 4,
      totalModules: 8,
      progressPct: 50,
      status: "In Progress",
      estimatedCompletion: "Sep 20, 2026",
      isFavourite: false,
      description: "Deep learning fundamentals covering Convolutional Neural Networks, Transformers, and LLM fine-tuning techniques.",
      modules: [
        { id: 1, title: "Module 1: Linear Algebra & Matrix Calculus", completed: true },
        { id: 2, title: "Module 2: Perceptrons & Multi-Layer Feedforward Nets", completed: true },
        { id: 3, title: "Module 3: Backpropagation Mechanics", completed: true },
        { id: 4, title: "Module 4: Convolutional Neural Networks for Vision", completed: true },
        { id: 5, title: "Module 5: Recurrent Neural Networks & LSTMs", completed: false },
        { id: 6, title: "Module 6: Attention Mechanism & Transformer Models", completed: false },
        { id: 7, title: "Module 7: Fine-Tuning LLMs & Prompt Engineering", completed: false },
        { id: 8, title: "Module 8: AI Ethics & Model Evaluation", completed: false }
      ]
    },
    {
      id: "CRS-104",
      title: "UI/UX Design Systems & Micro-Interactions",
      instructor: "Elena Rostova",
      category: "Design",
      difficulty: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600",
      modulesCompleted: 6,
      totalModules: 6,
      progressPct: 100,
      status: "Completed",
      estimatedCompletion: "Completed Jun 28, 2026",
      isFavourite: true,
      description: "Design systematic UI frameworks, tokenized component libraries, glassmorphism, and responsive micro-animations.",
      modules: [
        { id: 1, title: "Module 1: Visual Hierarchy & Grid Layout Systems", completed: true },
        { id: 2, title: "Module 2: Color Theory & Accessible Contrast", completed: true },
        { id: 3, title: "Module 3: Typography & Micro-Copy", completed: true },
        { id: 4, title: "Module 4: Design Tokens & Atomic Design Principles", completed: true },
        { id: 5, title: "Module 5: Prototyping & Motion Design", completed: true },
        { id: 6, title: "Module 6: Building a Commercial Design System", completed: true }
      ]
    },
    {
      id: "CRS-105",
      title: "Database Management & Distributed Systems",
      instructor: "Prof. Michael Stone",
      category: "Database",
      difficulty: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600",
      modulesCompleted: 3,
      totalModules: 10,
      progressPct: 30,
      status: "In Progress",
      estimatedCompletion: "Oct 15, 2026",
      isFavourite: false,
      description: "Distributed database architecture, ACID guarantees, Raft consensus, sharding, and high availability systems.",
      modules: [
        { id: 1, title: "Module 1: Relational Algebra & SQL Mastery", completed: true },
        { id: 2, title: "Module 2: B-Trees & LSM Indexing Engines", completed: true },
        { id: 3, title: "Module 3: Query Planning & Cost Optimization", completed: true },
        { id: 4, title: "Module 4: Concurrency Control & Isolation Levels", completed: false },
        { id: 5, title: "Module 5: Distributed Transactions & Two-Phase Commit", completed: false },
        { id: 6, title: "Module 6: Consensus Protocols (Paxos & Raft)", completed: false },
        { id: 7, title: "Module 7: Database Sharding & Partitioning", completed: false },
        { id: 8, title: "Module 8: NoSQL, Document & Key-Value Stores", completed: false },
        { id: 9, title: "Module 9: Real-time Replication & Event Sourcing", completed: false },
        { id: 10, title: "Module 10: High Availability & Disaster Recovery", completed: false }
      ]
    },
    {
      id: "CRS-106",
      title: "Cloud Native & DevOps Engineering",
      instructor: "David Miller",
      category: "Cloud",
      difficulty: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
      modulesCompleted: 0,
      totalModules: 8,
      progressPct: 0,
      status: "Not Started",
      estimatedCompletion: "Nov 30, 2026",
      isFavourite: false,
      description: "Docker containerization, Kubernetes orchestration, Infrastructure as Code with Terraform, and Prometheus monitoring.",
      modules: [
        { id: 1, title: "Module 1: Linux System Administration & Shell Scripting", completed: false },
        { id: 2, title: "Module 2: Docker Containers & Image Optimization", completed: false },
        { id: 3, title: "Module 3: Kubernetes Architecture & Pod Management", completed: false },
        { id: 4, title: "Module 4: Infrastructure as Code with Terraform", completed: false },
        { id: 5, title: "Module 5: Automated CI/CD Pipelines with GitHub Actions", completed: false },
        { id: 6, title: "Module 6: Service Mesh & Ingress Controllers", completed: false },
        { id: 7, title: "Module 7: Observability (Prometheus, Grafana & Jaeger)", completed: false },
        { id: 8, title: "Module 8: Cloud Security & Identity Access Management", completed: false }
      ]
    }
  ],

  grades: [
    {
      id: "GRD-1",
      courseId: "CRS-101",
      courseName: "Advanced Data Structures & Algorithms",
      quizScore: 94,
      assignmentScore: 92,
      midtermScore: 90,
      finalScore: 95,
      overallPct: 92.8,
      gradeBadge: "A+",
      rank: 2,
      credits: 4
    },
    {
      id: "GRD-2",
      courseId: "CRS-102",
      courseName: "Modern Full-Stack SaaS Architecture",
      quizScore: 98,
      assignmentScore: 96,
      midtermScore: 95,
      finalScore: 99,
      overallPct: 97.2,
      gradeBadge: "A+",
      rank: 1,
      credits: 4
    },
    {
      id: "GRD-3",
      courseId: "CRS-103",
      courseName: "Artificial Intelligence & Neural Networks",
      quizScore: 88,
      assignmentScore: 85,
      midtermScore: 86,
      finalScore: 89,
      overallPct: 87.0,
      gradeBadge: "A",
      rank: 5,
      credits: 4
    },
    {
      id: "GRD-4",
      courseId: "CRS-104",
      courseName: "UI/UX Design Systems & Micro-Interactions",
      quizScore: 100,
      assignmentScore: 98,
      midtermScore: 96,
      finalScore: 97,
      overallPct: 97.8,
      gradeBadge: "A+",
      rank: 1,
      credits: 3
    },
    {
      id: "GRD-5",
      courseId: "CRS-105",
      courseName: "Database Management & Distributed Systems",
      quizScore: 85,
      assignmentScore: 84,
      midtermScore: 82,
      finalScore: 88,
      overallPct: 84.8,
      gradeBadge: "B+",
      rank: 8,
      credits: 3
    }
  ],

  attendance: {
    overallPct: 92,
    presentDays: 68,
    absentDays: 4,
    lateDays: 2,
    leaveDays: 2,
    monthlyData: [
      { month: "Feb", pct: 95 },
      { month: "Mar", pct: 92 },
      { month: "Apr", pct: 88 },
      { month: "May", pct: 96 },
      { month: "Jun", pct: 94 },
      { month: "Jul", pct: 92 }
    ],
    subjectWise: [
      { subject: "Advanced Data Structures & Algorithms", present: 22, total: 24, pct: 91.6, status: "Good" },
      { subject: "Modern Full-Stack SaaS Architecture", present: 24, total: 24, pct: 100.0, status: "Good" },
      { subject: "Artificial Intelligence & Neural Networks", present: 20, total: 22, pct: 90.9, status: "Good" },
      { subject: "UI/UX Design Systems", present: 18, total: 18, pct: 100.0, status: "Good" },
      { subject: "Database Management Systems", present: 16, total: 20, pct: 80.0, status: "Warning" }
    ]
  },

  assignments: [
    {
      id: "ASN-101",
      title: "Red-Black Tree & Segment Tree Implementation",
      course: "Advanced Data Structures & Algorithms",
      deadline: "2026-07-30",
      priority: "High",
      status: "Pending",
      description: "Implement a self-balancing Red-Black Tree and Range Query Segment Tree with full unit testing suite in C++ or Java."
    },
    {
      id: "ASN-102",
      title: "Transformer Model Self-Attention Layer",
      course: "Artificial Intelligence & Neural Networks",
      deadline: "2026-08-05",
      priority: "High",
      status: "Pending",
      description: "Construct multi-head self-attention mechanisms using NumPy and PyTorch from scratch."
    },
    {
      id: "ASN-103",
      title: "Multi-Tenant SaaS Database Schema Architecture",
      course: "Database Management & Distributed Systems",
      deadline: "2026-08-10",
      priority: "Medium",
      status: "Pending",
      description: "Design isolated tenant database schemas with foreign key constraints, connection pooling, and migration scripts."
    },
    {
      id: "ASN-104",
      title: "Stripe Webhook Event Handling System",
      course: "Modern Full-Stack SaaS Architecture",
      deadline: "2026-07-20",
      priority: "High",
      status: "Submitted",
      description: "Build robust idempotent Stripe webhook processing logic with queue retries and invoice generation."
    },
    {
      id: "ASN-105",
      title: "Accessible Commercial Glassmorphism UI Token System",
      course: "UI/UX Design Systems & Micro-Interactions",
      deadline: "2026-06-25",
      priority: "Low",
      status: "Graded",
      grade: "100/100",
      description: "Construct a complete design system in CSS with light/dark contrast tokens compliant with WCAG AA standards."
    }
  ],

  certificates: [
    {
      id: "CERT-9041",
      title: "Mastering Modern Full-Stack SaaS Architecture",
      course: "Modern Full-Stack SaaS Architecture",
      instructor: "Prof. Sarah Jenkins",
      issueDate: "July 10, 2026",
      credentialId: "STANFORD-SaaS-2026-9041",
      verificationUrl: "https://verify.stanford.edu/cert/STANFORD-SaaS-2026-9041"
    },
    {
      id: "CERT-8832",
      title: "Commercial UI/UX & Design Systems Specialist",
      course: "UI/UX Design Systems & Micro-Interactions",
      instructor: "Elena Rostova",
      issueDate: "June 28, 2026",
      credentialId: "STANFORD-UIUX-2026-8832",
      verificationUrl: "https://verify.stanford.edu/cert/STANFORD-UIUX-2026-8832"
    },
    {
      id: "CERT-7721",
      title: "Certified Distributed Systems & Cloud Engineer",
      course: "Cloud Native & DevOps Foundations",
      instructor: "David Miller",
      issueDate: "May 15, 2026",
      credentialId: "STANFORD-CLOUD-2026-7721",
      verificationUrl: "https://verify.stanford.edu/cert/STANFORD-CLOUD-2026-7721"
    },
    {
      id: "CERT-6610",
      title: "Algorithmic Complexity & Optimization Scholar",
      course: "Data Structures Foundations",
      instructor: "Dr. Robert Vance",
      issueDate: "April 02, 2026",
      credentialId: "STANFORD-ALGO-2026-6610",
      verificationUrl: "https://verify.stanford.edu/cert/STANFORD-ALGO-2026-6610"
    }
  ],

  notifications: [
    {
      id: "NTF-1",
      title: "Upcoming Assignment Deadline",
      message: "'Red-Black Tree & Segment Tree' is due in 4 days (Jul 30).",
      type: "reminder",
      timestamp: "10 minutes ago",
      isUnread: true
    },
    {
      id: "NTF-2",
      title: "Low Attendance Warning",
      message: "Attendance in Database Management Systems is 80%. Keep above 85% to avoid penalty.",
      type: "warning",
      timestamp: "2 hours ago",
      isUnread: true
    },
    {
      id: "NTF-3",
      title: "Certificate Generated",
      message: "Your certificate for 'Modern Full-Stack SaaS Architecture' is now ready for download.",
      type: "achievement",
      timestamp: "1 day ago",
      isUnread: false
    },
    {
      id: "NTF-4",
      title: "New Quiz Available",
      message: "AI & Neural Networks Module 5 self-assessment quiz is open.",
      type: "info",
      timestamp: "2 days ago",
      isUnread: false
    }
  ],

  activityFeed: [
    {
      id: "ACT-1",
      title: "Completed Lesson",
      description: "Finished 'NP-Completeness & Approximation' in Advanced Data Structures",
      timestamp: "Today, 02:45 PM",
      icon: "fa-circle-check",
      iconColor: "var(--success)"
    },
    {
      id: "ACT-2",
      title: "Assignment Submitted",
      description: "Submitted 'Stripe Webhook Event Handling System'",
      timestamp: "Yesterday, 06:15 PM",
      icon: "fa-file-arrow-up",
      iconColor: "var(--primary)"
    },
    {
      id: "ACT-3",
      title: "Certificate Earned",
      description: "Successfully earned 'Mastering Modern Full-Stack SaaS Architecture'",
      timestamp: "Jul 10, 2026",
      icon: "fa-award",
      iconColor: "var(--warning)"
    },
    {
      id: "ACT-4",
      title: "Quiz Completed",
      description: "Scored 100/100 on Design Tokens & Accessibility Quiz",
      timestamp: "Jul 05, 2026",
      icon: "fa-list-check",
      iconColor: "var(--purple)"
    },
    {
      id: "ACT-5",
      title: "Account Login",
      description: "Authenticated securely from Chrome OS X (San Francisco, CA)",
      timestamp: "Jul 01, 2026",
      icon: "fa-shield-halved",
      iconColor: "var(--secondary)"
    }
  ],

  settings: {
    theme: "light",
    accentColor: "indigo",
    autoLogoutMinutes: 30,
    emailNotifications: true,
    assignmentReminders: true,
    lowAttendanceAlerts: true,
    privacyProfilePublic: false
  }
};
