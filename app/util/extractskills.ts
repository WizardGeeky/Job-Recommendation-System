import fs from "fs-extra";
import path from "path";
import mammoth from "mammoth";
import { v2 as cloudinary } from "cloudinary";

const skillKeywords = [
  // Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "Rust",
  "Dart",
  "PHP",
  "Perl",
  "Scala",
  "R",
  "Objective-C",

  // Web Development
  "HTML",
  "CSS",
  "SASS",
  "SCSS",
  "Bootstrap",
  "Tailwind CSS",
  "React",
  "Next.js",
  "Vue.js",
  "Nuxt.js",
  "Angular",
  "Svelte",
  "jQuery",
  "Redux",
  "Zustand",

  // Backend Technologies
  "Node.js",
  "Express.js",
  "NestJS",
  "Django",
  "Flask",
  "Spring Boot",
  "FastAPI",
  "ASP.NET",
  "Laravel",
  "Ruby on Rails",
  "GraphQL",
  "REST API",
  "tRPC",

  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "Oracle",
  "Firebase",
  "Redis",
  "Cassandra",
  "DynamoDB",
  "MariaDB",
  "Neo4j",
  "CouchDB",

  // DevOps & Cloud
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Terraform",
  "Jenkins",
  "GitHub Actions",
  "CI/CD",
  "Ansible",
  "Cloudflare",
  "Vercel",
  "Netlify",

  // Mobile Development
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "Objective-C",
  "Xamarin",
  "Ionic",
  "Cordova",

  // Blockchain & Web3
  "Solidity",
  "Smart Contracts",
  "Ethereum",
  "Polygon",
  "Binance Smart Chain",
  "IPFS",
  "Web3.js",
  "Ethers.js",
  "Hardhat",
  "Truffle",
  "NFT",
  "DeFi",
  "DApp",

  // Machine Learning & AI
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Keras",
  "OpenCV",
  "NLP",
  "Computer Vision",
  "Deep Learning",
  "Hugging Face",
  "LangChain",

  // Cybersecurity
  "Penetration Testing",
  "Ethical Hacking",
  "OWASP",
  "Burp Suite",
  "Metasploit",
  "Cyber Threat Intelligence",
  "Security Testing",

  // Game Development
  "Unity",
  "Unreal Engine",
  "Godot",
  "Cocos2d",
  "Blender",
  "3D Modeling",
  "Game Physics",

  // Data Science & Analytics
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "SQL",
  "Power BI",
  "Tableau",
  "Data Visualization",
  "Big Data",

  // Testing & Automation
  "Selenium",
  "Cypress",
  "Jest",
  "Mocha",
  "Chai",
  "PyTest",
  "JUnit",
  "Postman",
  "Load Testing",

  // Version Control
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "SVN",

  // Networking & System Administration
  "Linux",
  "Bash Scripting",
  "Nginx",
  "Apache",
  "Kubernetes",
  "Cloudflare",
  "DNS Management",

  // Miscellaneous
  "WebSockets",
  "Socket.io",
  "Microservices",
  "GraphQL Subscriptions",
  "WebRTC",
  "RabbitMQ",
  "Kafka",
];

export async function extractSkillsFromResume(encryptedEmail: string): Promise<string[]> {
  try {
    const cloudinaryFileUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/v1690000000/resumes/${encryptedEmail}.docx`;

    const response = await fetch(cloudinaryFileUrl);
    if (!response.ok) {
      return [];
    }
    // Convert ArrayBuffer to Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from DOCX
    const { value: extractedText } = await mammoth.extractRawText({ buffer });

    // Match skills using predefined skill keywords
    return skillKeywords.filter((skill) => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escapedSkill}\\b`, "i").test(extractedText);
    });

  } catch (error) {
    return [];
  }
}
