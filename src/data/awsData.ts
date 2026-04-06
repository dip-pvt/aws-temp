export interface AWSService {
  id: string;
  name: string;
  category: 'Compute' | 'Storage' | 'Database' | 'Networking' | 'Security' | 'Machine Learning' | 'Analytics';
  description: string;
  icon: string;
  useCase: string;
}

export const awsServices: AWSService[] = [
  {
    id: 'ec2',
    name: 'Amazon EC2',
    category: 'Compute',
    description: 'Secure and resizable compute capacity in the cloud.',
    icon: 'Server',
    useCase: 'Running web servers, batch processing, and high-performance computing.'
  },
  {
    id: 's3',
    name: 'Amazon S3',
    category: 'Storage',
    description: 'Object storage built to retrieve any amount of data from anywhere.',
    icon: 'Database',
    useCase: 'Static website hosting, data lakes, and backup/restore.'
  },
  {
    id: 'rds',
    name: 'Amazon RDS',
    category: 'Database',
    description: 'Managed Relational Database Service for MySQL, PostgreSQL, etc.',
    icon: 'DatabaseZap',
    useCase: 'Running transactional databases without managing infrastructure.'
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    category: 'Compute',
    description: 'Run code without thinking about servers. Pay only for the compute time you consume.',
    icon: 'Zap',
    useCase: 'Serverless backends, automated backups, and real-time data processing.'
  },
  {
    id: 'vpc',
    name: 'Amazon VPC',
    category: 'Networking',
    description: 'Provision a logically isolated section of the AWS Cloud.',
    icon: 'Network',
    useCase: 'Defining custom networks, subnets, and security groups.'
  },
  {
    id: 'iam',
    name: 'AWS IAM',
    category: 'Security',
    description: 'Securely manage access to AWS services and resources.',
    icon: 'ShieldCheck',
    useCase: 'Managing user permissions and multi-factor authentication.'
  },
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB',
    category: 'Database',
    description: 'Fast and flexible NoSQL database service for any scale.',
    icon: 'Table',
    useCase: 'Mobile apps, gaming backends, and high-traffic web apps.'
  },
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    category: 'Networking',
    description: 'Fast, highly secure and programmable content delivery network (CDN).',
    icon: 'Globe',
    useCase: 'Accelerating static and dynamic web content delivery.'
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which AWS service is best for hosting a static website with high availability?",
    options: ["Amazon EC2", "Amazon S3", "AWS Lambda", "Amazon RDS"],
    correctAnswer: 1,
    explanation: "Amazon S3 can host static websites and is highly durable and available."
  },
  {
    id: 2,
    question: "What does 'Serverless' mean in the context of AWS Lambda?",
    options: [
      "There are no servers involved",
      "You don't have to manage or provision servers",
      "The code runs on your local machine",
      "It only works for small scripts"
    ],
    correctAnswer: 1,
    explanation: "Serverless means AWS manages the underlying infrastructure, so you only focus on code."
  },
  {
    id: 3,
    question: "Which service provides managed relational databases?",
    options: ["Amazon DynamoDB", "Amazon Redshift", "Amazon RDS", "Amazon ElastiCache"],
    correctAnswer: 2,
    explanation: "Amazon RDS (Relational Database Service) is specifically for SQL-based databases."
  }
];
