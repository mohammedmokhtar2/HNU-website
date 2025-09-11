#!/usr/bin/env node

/**
 * Migration script to convert existing API routes to use automatic audit logging
 *
 * This script will:
 * 1. Find all route.ts files in the app/api directory
 * 2. Add the necessary import for autoWrapRouteHandlers
 * 3. Replace manual withAuditLog wrapping with automatic wrapping
 * 4. Update the export statement to use autoWrapRouteHandlers
 */

const fs = require('fs');
const path = require('path');

const API_DIR = 'app/api';
const IMPORT_STATEMENT =
  "import { autoWrapRouteHandlers } from '@/lib/middleware/autoWrapRoutes';";

function findRouteFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item === 'route.ts') {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function migrateRouteFile(filePath) {
  console.log(`Migrating ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if already migrated
  if (content.includes('autoWrapRouteHandlers')) {
    console.log(`  ✓ Already migrated`);
    return;
  }

  // Add import statement if not present
  if (!content.includes('autoWrapRouteHandlers')) {
    // Find the last import statement
    const importRegex = /^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
    const imports = content.match(importRegex) || [];

    if (imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;

      content =
        content.slice(0, insertIndex) +
        '\n' +
        IMPORT_STATEMENT +
        '\n' +
        content.slice(insertIndex);
      modified = true;
    } else {
      // No imports found, add at the top
      content = IMPORT_STATEMENT + '\n\n' + content;
      modified = true;
    }
  }

  // Remove withAuditLog imports and usage
  if (content.includes('withAuditLog')) {
    // Remove withAuditLog import
    content = content.replace(
      /import\s*{\s*withAuditLog\s*}\s*from\s*['"][^'"]+['"];?\s*\n?/g,
      ''
    );

    // Find and replace withAuditLog usage
    const withAuditLogRegex =
      /export\s+const\s+(\w+)\s*=\s*withAuditLog\s*\(\s*([^,]+),\s*\{[^}]+\}\s*\)\s*;?/g;
    const matches = content.match(withAuditLogRegex);

    if (matches) {
      // Extract function names and their handlers
      const functionMap = {};

      matches.forEach(match => {
        const funcMatch = match.match(
          /export\s+const\s+(\w+)\s*=\s*withAuditLog\s*\(\s*([^,]+),/
        );
        if (funcMatch) {
          const [, funcName, handlerName] = funcMatch;
          functionMap[funcName] = handlerName.trim();
        }
      });

      // Remove the withAuditLog exports
      content = content.replace(withAuditLogRegex, '');

      // Add the functions as regular async functions if they don't exist
      Object.entries(functionMap).forEach(([funcName, handlerName]) => {
        if (!content.includes(`async function ${funcName}`)) {
          // Find the handler function and rename it
          const handlerRegex = new RegExp(
            `(async\\s+function\\s+)${handlerName}\\s*\\(`,
            'g'
          );
          content = content.replace(handlerRegex, `$1${funcName}(`);
        }
      });
    }
  }

  // Update export statement to use autoWrapRouteHandlers
  const exportRegex = /export\s+const\s*\{\s*([^}]+)\s*\}\s*=\s*\{[^}]+\}\s*;?/;
  const exportMatch = content.match(exportRegex);

  if (exportMatch) {
    const functionNames = exportMatch[1].split(',').map(name => name.trim());
    const exportStatement = `export const { ${functionNames.join(', ')} } = autoWrapRouteHandlers({\n  ${functionNames.join(',\n  ')}\n});`;

    content = content.replace(exportRegex, exportStatement);
    modified = true;
  } else {
    // Look for individual exports and group them
    const individualExports = content.match(
      /export\s+(?:async\s+)?function\s+(\w+)/g
    );
    if (individualExports) {
      const functionNames = individualExports
        .map(exp => {
          const match = exp.match(/export\s+(?:async\s+)?function\s+(\w+)/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      if (functionNames.length > 0) {
        // Remove individual exports
        functionNames.forEach(funcName => {
          const funcRegex = new RegExp(
            `export\\s+(async\\s+)?function\\s+${funcName}`,
            'g'
          );
          content = content.replace(funcRegex, '$1function ' + funcName);
        });

        // Add grouped export
        const exportStatement = `\nexport const { ${functionNames.join(', ')} } = autoWrapRouteHandlers({\n  ${functionNames.join(',\n  ')}\n});`;
        content += exportStatement;
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Migrated successfully`);
  } else {
    console.log(`  - No changes needed`);
  }
}

function main() {
  console.log('Starting route migration to automatic audit logging...\n');

  const routeFiles = findRouteFiles(API_DIR);
  console.log(`Found ${routeFiles.length} route files to process:\n`);

  routeFiles.forEach(file => {
    console.log(`  ${file}`);
  });

  console.log('\nStarting migration...\n');

  routeFiles.forEach(migrateRouteFile);

  console.log('\n✓ Migration completed!');
  console.log('\nNext steps:');
  console.log('1. Review the changes made to each file');
  console.log('2. Test the API endpoints to ensure they work correctly');
  console.log('3. Check that audit logs are being created properly');
  console.log('4. Remove any unused withAuditLog imports if they exist');
}

if (require.main === module) {
  main();
}

module.exports = { migrateRouteFile, findRouteFiles };
