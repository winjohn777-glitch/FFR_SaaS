#!/usr/bin/env python3
"""
Quality Checker - Automated code quality validation for Florida First Roofing
Ensures code consistency, TypeScript compliance, and prevents common issues.
"""

import os
import sys
import json
import subprocess
import argparse
from pathlib import Path
from typing import List, Dict, Any
import re

class QualityChecker:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.typescript_config = self.project_root / "tsconfig.json"
        self.package_json = self.project_root / "package.json"
        self.src_dir = self.project_root / "src"
        
    def check_typescript_errors(self) -> Dict[str, Any]:
        """Check for TypeScript compilation errors"""
        print("🔍 Checking TypeScript compilation...")
        
        try:
            result = subprocess.run(
                ["npx", "tsc", "--noEmit", "--pretty"],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            errors = []
            warnings = []
            
            if result.stderr or result.returncode != 0:
                output = result.stderr + result.stdout
                for line in output.split('\n'):
                    if 'error TS' in line:
                        errors.append(line.strip())
                    elif 'warning' in line.lower():
                        warnings.append(line.strip())
            
            return {
                "status": "pass" if len(errors) == 0 else "fail",
                "errors": errors,
                "warnings": warnings,
                "error_count": len(errors),
                "warning_count": len(warnings)
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "errors": [],
                "warnings": []
            }
    
    def check_eslint_issues(self) -> Dict[str, Any]:
        """Check ESLint for code quality issues"""
        print("🔍 Checking ESLint issues...")
        
        try:
            result = subprocess.run(
                ["npm", "run", "lint"],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            issues = []
            error_count = 0
            warning_count = 0
            
            for line in result.stdout.split('\n'):
                if 'error' in line and '✖' not in line:
                    error_count += 1
                    issues.append({"type": "error", "message": line.strip()})
                elif 'warning' in line:
                    warning_count += 1
                    issues.append({"type": "warning", "message": line.strip()})
            
            return {
                "status": "pass" if error_count == 0 else "fail",
                "issues": issues,
                "error_count": error_count,
                "warning_count": warning_count
            }
        except Exception as e:
            return {
                "status": "error", 
                "error": str(e),
                "issues": []
            }
    
    def find_duplicate_files(self) -> Dict[str, Any]:
        """Find duplicate or backup files that shouldn't exist"""
        print("🔍 Checking for duplicate/backup files...")
        
        issues = []
        
        # Look for backup files
        backup_patterns = ["*.backup", "*.bak", "*_backup.*"]
        for pattern in backup_patterns:
            for file_path in self.src_dir.rglob(pattern):
                issues.append({
                    "type": "duplicate_file",
                    "path": str(file_path.relative_to(self.project_root)),
                    "description": f"Backup file found: {file_path.name}"
                })
        
        # Look for duplicate component names
        component_files = {}
        for tsx_file in self.src_dir.rglob("*.tsx"):
            component_name = tsx_file.stem
            if component_name in component_files:
                issues.append({
                    "type": "duplicate_component",
                    "path": str(tsx_file.relative_to(self.project_root)),
                    "description": f"Duplicate component name: {component_name}"
                })
            else:
                component_files[component_name] = str(tsx_file.relative_to(self.project_root))
        
        return {
            "status": "pass" if len(issues) == 0 else "warn",
            "issues": issues,
            "issue_count": len(issues)
        }
    
    def check_import_consistency(self) -> Dict[str, Any]:
        """Check for consistent import patterns and unused imports"""
        print("🔍 Checking import consistency...")
        
        issues = []
        import_patterns = {}
        
        for tsx_file in self.src_dir.rglob("*.tsx"):
            try:
                with open(tsx_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Check for unused imports (basic check)
                import_lines = [line for line in content.split('\n') if line.strip().startswith('import')]
                for import_line in import_lines:
                    # Extract imported names
                    match = re.search(r'import\s+\{([^}]+)\}', import_line)
                    if match:
                        imports = [imp.strip() for imp in match.group(1).split(',')]
                        for imp in imports:
                            # Check if import is used in file
                            if f'<{imp}' not in content and f'use{imp}' not in content and imp not in content.split('<')[1].split('>')[0] if '<' in content else []:
                                issues.append({
                                    "type": "unused_import",
                                    "file": str(tsx_file.relative_to(self.project_root)),
                                    "import": imp,
                                    "line": import_line.strip()
                                })
                                
            except Exception as e:
                issues.append({
                    "type": "read_error",
                    "file": str(tsx_file.relative_to(self.project_root)),
                    "error": str(e)
                })
        
        return {
            "status": "pass" if len(issues) == 0 else "warn",
            "issues": issues,
            "issue_count": len(issues)
        }
    
    def check_central_store_usage(self) -> Dict[str, Any]:
        """Verify proper usage of central store and data patterns"""
        print("🔍 Checking central store usage patterns...")
        
        issues = []
        central_store_file = self.src_dir / "stores" / "centralStore.ts"
        
        if not central_store_file.exists():
            issues.append({
                "type": "missing_file",
                "file": "src/stores/centralStore.ts",
                "description": "Central store file not found"
            })
            return {"status": "fail", "issues": issues}
        
        # Check if components are using central store properly
        for tsx_file in self.src_dir.rglob("*.tsx"):
            try:
                with open(tsx_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check for direct state management instead of central store
                if 'useState(' in content and 'useCentralStore' not in content:
                    if 'Page' in str(tsx_file) or any(page in str(tsx_file) for page in ['CRM', 'ProjectManagement', 'Invoicing']):
                        issues.append({
                            "type": "incorrect_state_usage",
                            "file": str(tsx_file.relative_to(self.project_root)),
                            "description": "Page component using useState instead of central store"
                        })
                        
            except Exception:
                continue
        
        return {
            "status": "pass" if len(issues) == 0 else "warn",
            "issues": issues,
            "issue_count": len(issues)
        }
    
    def run_full_check(self) -> Dict[str, Any]:
        """Run all quality checks"""
        print("🚀 Running full quality check...")
        print("=" * 50)
        
        results = {
            "typescript": self.check_typescript_errors(),
            "eslint": self.check_eslint_issues(),
            "duplicates": self.find_duplicate_files(),
            "imports": self.check_import_consistency(),
            "central_store": self.check_central_store_usage()
        }
        
        # Summary
        total_errors = sum(r.get("error_count", 0) for r in results.values())
        total_warnings = sum(r.get("warning_count", 0) for r in results.values())
        total_issues = sum(r.get("issue_count", 0) for r in results.values())
        
        print("\n" + "=" * 50)
        print("📊 QUALITY CHECK SUMMARY")
        print("=" * 50)
        
        for check_name, result in results.items():
            status_emoji = "✅" if result["status"] == "pass" else "⚠️" if result["status"] == "warn" else "❌"
            print(f"{status_emoji} {check_name.upper()}: {result['status'].upper()}")
            
            if result.get("error_count", 0) > 0:
                print(f"   Errors: {result['error_count']}")
            if result.get("warning_count", 0) > 0:
                print(f"   Warnings: {result['warning_count']}")
            if result.get("issue_count", 0) > 0:
                print(f"   Issues: {result['issue_count']}")
        
        print(f"\n📈 TOTAL: {total_errors} errors, {total_warnings} warnings, {total_issues} issues")
        
        overall_status = "pass" if total_errors == 0 else "fail"
        print(f"\n🎯 OVERALL STATUS: {overall_status.upper()}")
        
        return {
            "overall_status": overall_status,
            "results": results,
            "summary": {
                "total_errors": total_errors,
                "total_warnings": total_warnings,
                "total_issues": total_issues
            }
        }

def main():
    parser = argparse.ArgumentParser(description="Quality checker for Florida First Roofing project")
    parser.add_argument("--type", choices=["typescript", "eslint", "duplicates", "imports", "central_store", "all"], 
                       default="all", help="Type of check to run")
    parser.add_argument("--project-root", default=".", help="Project root directory")
    parser.add_argument("--output", help="Output results to JSON file")
    
    args = parser.parse_args()
    
    checker = QualityChecker(args.project_root)
    
    if args.type == "all":
        results = checker.run_full_check()
    else:
        method_map = {
            "typescript": checker.check_typescript_errors,
            "eslint": checker.check_eslint_issues,
            "duplicates": checker.find_duplicate_files,
            "imports": checker.check_import_consistency,
            "central_store": checker.check_central_store_usage
        }
        results = method_map[args.type]()
        print(json.dumps(results, indent=2))
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n💾 Results saved to {args.output}")
    
    # Exit with error code if issues found
    if results.get("overall_status") == "fail" or results.get("status") == "fail":
        sys.exit(1)

if __name__ == "__main__":
    main()

