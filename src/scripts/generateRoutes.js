
import fs from 'fs'
import path from 'path'
// 1. Aapki config se extracted unique paths
// Students, Classes, aur Attendance ko exclude kar diya hai
const routes = [
  '/platform/dashboard',
  '/platform/subjects',
  '/platform/assignments',
  '/platform/exams',
  '/platform/admit-cards',
  '/platform/results',
  '/platform/fees',
  '/platform/invoices',
  '/platform/payroll',
  '/platform/staff',
  '/platform/roles',
  '/platform/leads',
  '/platform/admission-reports',
  '/platform/infrastructure',
  '/platform/transport',
  '/platform/notices',
  '/platform/user-roles',
  '/platform/access-control',
  '/platform/settings'
];

const BASE_DIR = path.join(process.cwd(), 'src/app');

const generateContent = (routeName) => {
  // Path se naam nikalne ke liye: /platform/user-roles -> UserRoles
  const name = routeName
    .split('/')
    .pop()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return `"use client";
import React from 'react';

const ${name}Page = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">${name} Module</h1>
      <p className="text-slate-500">Welcome to the ${name} management section.</p>
    </div>
  );
};

export default ${name}Page;
`;
};

const createRoutes = () => {
  routes.forEach((route) => {
    // path.join logic for absolute path
    const targetDir = path.join(BASE_DIR, route.replace(/^\//, ''));
    const filePath = path.join(targetDir, 'page.tsx');

    // 1. Folder create karein agar nahi hai toh
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`✅ Created Folder: ${targetDir}`);
    }

    // 2. page.tsx create karein agar file pehle se exist nahi karti
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, generateContent(route));
      console.log(`📄 Created Page: ${filePath}`);
    } else {
      console.log(`⚠️  Skipped (Already Exists): ${filePath}`);
    }
  });
};

console.log("🚀 Starting Route Generation...");
createRoutes();
console.log("✨ All routes generated inside src/app/platform!");