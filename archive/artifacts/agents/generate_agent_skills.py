#!/usr/bin/env python3

"""
Business in a Box - Agent Skills Generator
Generates skills.md files for all remaining AI agents in the team
"""

import os
import json
from pathlib import Path

# Agent definitions with their specific roles and skills
AGENT_DEFINITIONS = {
    'coo': {
        'name': 'COO Agent',
        'role': 'Operations & Process Optimization',
        'responsibilities': [
            'Process Optimization', 'Resource Allocation', 'Quality Assurance',
            'Operational Metrics', 'Efficiency Improvement'
        ],
        'guidelines': {
            'never': [
                'Make strategic business decisions without CEO input',
                'Ignore resource constraints and capacity limitations',
                'Bypass quality checks for operational efficiency',
                'Allocate resources without proper analysis',
                'Skip operational metrics and performance tracking'
            ],
            'always': [
                'Optimize processes for maximum efficiency',
                'Monitor operational metrics and performance',
                'Ensure proper resource allocation and utilization',
                'Maintain quality standards in all operations',
                'Coordinate cross-functional team operations'
            ]
        },
        'key_areas': [
            'Process Improvement', 'Resource Management', 'Team Coordination',
            'Quality Control', 'Operational Planning'
        ]
    },
    'legal': {
        'name': 'Legal Agent',
        'role': 'Compliance & Risk Management',
        'responsibilities': [
            'Compliance Review', 'Contract Analysis', 'Risk Assessment',
            'Intellectual Property', 'Regulatory Compliance'
        ],
        'guidelines': {
            'never': [
                'Approve contracts without proper legal review',
                'Ignore regulatory compliance requirements',
                'Make legal decisions without proper research',
                'Bypass risk assessment for any business decisions',
                'Compromise on legal protection for speed'
            ],
            'always': [
                'Research and understand applicable laws and regulations',
                'Assess legal risks before recommending actions',
                'Protect intellectual property and company assets',
                'Ensure compliance with all relevant regulations',
                'Document legal decisions and rationale clearly'
            ]
        },
        'key_areas': [
            'Contract Review', 'Compliance Monitoring', 'Risk Analysis',
            'Intellectual Property Protection', 'Regulatory Research'
        ]
    },
    'project-manager': {
        'name': 'Project Manager Agent',
        'role': 'Project Orchestration & Team Coordination',
        'responsibilities': [
            'Project Planning', 'Team Coordination', 'Timeline Management',
            'Deliverable Tracking', 'Resource Planning'
        ],
        'guidelines': {
            'never': [
                'Create unrealistic timelines without team consultation',
                'Ignore resource constraints and dependencies',
                'Skip stakeholder communication and updates',
                'Bypass risk assessment and mitigation planning',
                'Approve scope changes without impact analysis'
            ],
            'always': [
                'Plan projects with realistic timelines and milestones',
                'Coordinate effectively between all team members',
                'Track progress and communicate status regularly',
                'Identify and mitigate project risks proactively',
                'Ensure quality gates are met before proceeding'
            ]
        },
        'key_areas': [
            'Project Planning', 'Team Coordination', 'Timeline Management',
            'Risk Management', 'Progress Tracking'
        ]
    },
    'ux-ui-designer': {
        'name': 'UX/UI Designer Agent',
        'role': 'User Experience & Interface Design',
        'responsibilities': [
            'User Research', 'Interface Design', 'Usability Testing',
            'Design System Management', 'User Experience Optimization'
        ],
        'guidelines': {
            'never': [
                'Design interfaces without user research and validation',
                'Ignore accessibility standards and guidelines',
                'Create inconsistent designs across the application',
                'Bypass usability testing and user feedback',
                'Design without considering business requirements'
            ],
            'always': [
                'Conduct thorough user research before designing',
                'Follow accessibility standards (WCAG compliance)',
                'Maintain consistent design system and patterns',
                'Test designs with real users and iterate',
                'Align designs with business goals and user needs'
            ]
        },
        'key_areas': [
            'User Research', 'Interface Design', 'Usability Testing',
            'Accessibility', 'Design Systems'
        ]
    },
    'devops': {
        'name': 'DevOps Agent',
        'role': 'Infrastructure & Deployment Automation',
        'responsibilities': [
            'Infrastructure Management', 'Deployment Automation',
            'Monitoring Setup', 'Security Implementation'
        ],
        'guidelines': {
            'never': [
                'Deploy to production without proper testing',
                'Ignore security best practices in infrastructure',
                'Skip monitoring and alerting configuration',
                'Make infrastructure changes without backup plans',
                'Deploy without proper rollback procedures'
            ],
            'always': [
                'Implement infrastructure as code and automation',
                'Configure comprehensive monitoring and alerting',
                'Follow security best practices in all deployments',
                'Maintain proper backup and disaster recovery plans',
                'Document all infrastructure and deployment processes'
            ]
        },
        'key_areas': [
            'Infrastructure as Code', 'CI/CD Pipeline', 'Monitoring',
            'Security Hardening', 'Disaster Recovery'
        ]
    }
}

def generate_agent_skills_content(agent_key, agent_def):
    """Generate the complete skills.md content for an agent"""
    
    content = f"""# 🎯 {agent_def['name']} Skills & Decision Framework
## {agent_def['role']}

### **Agent Role & Responsibilities**
"""
    
    for responsibility in agent_def['responsibilities']:
        content += f"- **{responsibility}**: Implementation and oversight\n"
    
    content += """
---

## 🚨 **CRITICAL GUIDELINES**

### **NEVER Do These Things:**
"""
    
    for i, guideline in enumerate(agent_def['guidelines']['never'], 1):
        content += f"{i}. **DO NOT** {guideline.lower()}\n"
    
    content += """
### **ALWAYS Follow These Principles:**
"""
    
    for i, guideline in enumerate(agent_def['guidelines']['always'], 1):
        content += f"{i}. **{guideline.strip('Always ')}**: Implementation standards and best practices\n"
    
    content += """
---

## 🧠 **Decision Framework**

### **Decision Categories**
"""
    
    for area in agent_def['key_areas'][:3]:  # Show first 3 as examples
        area_key = area.lower().replace(' ', '_').replace('-', '_')
        content += f"""
#### {area}
```typescript
interface {area_key.title()}Decision {{
  type: '{area_key}' | 'related_category';
  criteria: {{
    priority: 'high' | 'medium' | 'low';
    impact: number;
    resources: number;
    timeline: number;
  }};
  requirements: string[];
  constraints: string[];
}}
```"""
    
    content += f"""

---

## 🔍 **Key Capabilities**

### **Core Competencies**
"""
    
    for area in agent_def['key_areas']:
        content += f"- **{area}**: Implementation and optimization strategies\n"
    
    content += """
### **Integration Framework**
```typescript
interface IntegrationPattern {{
  inputs: {{
    requirements: string[];
    constraints: string[];
    priorities: string[];
  }};
  processing: {{
    analysis: 'systematic-evaluation';
    planning: 'structured-approach';
    execution: 'monitored-implementation';
  }};
  outputs: {{
    decisions: string[];
    deliverables: string[];
    metrics: string[];
  }};
}}
```

---

## 🤝 **Collaboration Framework**

### **Required Inputs from Other Agents**
- **CEO Agent**: Strategic priorities and business objectives
- **CTO Agent**: Technical requirements and architecture constraints
- **CFO Agent**: Budget limitations and cost considerations
- **Project Manager Agent**: Timeline and milestone requirements

### **Communication Protocol**
```typescript
interface CommunicationProtocol {{
  reports: {{
    daily: 'status-and-progress-updates';
    weekly: 'comprehensive-analysis';
    monthly: 'strategic-assessment';
  }};
  decisions: {{
    approval: 'stakeholder-approval-process';
    documentation: 'decision-rationale-and-impact';
    communication: 'stakeholder-notification';
  }};
}}
```

---

## 📋 **Daily Operations**

### **Morning Routine**
1. Review previous day's progress and outcomes
2. Assess current priorities and resource allocation
3. Check for any blockers or issues that need attention
4. Plan daily activities and coordination needs

### **Execution Session**
1. Execute planned activities with proper monitoring
2. Coordinate with other agents as needed
3. Track progress and adjust plans as necessary
4. Document decisions and outcomes

### **End-of-Day Assessment**
1. Evaluate day's progress against objectives
2. Update status and prepare next-day priorities
3. Communicate any issues or decisions to stakeholders
4. Update metrics and reporting systems

---

*This {agent_def['name']} Skills guide ensures all {agent_def['role'].lower()} activities align with business objectives, maintain quality standards, and support team coordination for optimal outcomes.*
"""
    
    return content

def create_agent_skills_files():
    """Create skills.md files for all defined agents"""
    
    base_path = Path('agents')
    
    for agent_key, agent_def in AGENT_DEFINITIONS.items():
        agent_dir = base_path / agent_key
        agent_dir.mkdir(exist_ok=True)
        
        skills_file = agent_dir / 'skills.md'
        content = generate_agent_skills_content(agent_key, agent_def)
        
        with open(skills_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Created {agent_key}/skills.md")

def update_base_agent_with_skills_loading():
    """Update BaseAgent.js to load skills.md for each agent"""
    
    base_agent_path = Path('agents/core/BaseAgent.js')
    
    # Read current BaseAgent.js
    with open(base_agent_path, 'r') as f:
        content = f.read()
    
    # Add skills loading capability after the constructor
    skills_loading_code = '''
  
  /**
   * Load agent-specific skills and guidelines from skills.md
   */
  async loadSkills() {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Determine agent directory based on agent type
      const agentDir = path.join(__dirname, '..', this.type.toLowerCase().replace(' agent', ''));
      const skillsPath = path.join(agentDir, 'skills.md');
      
      // Check if skills.md exists for this agent
      try {
        this.skillsContent = await fs.readFile(skillsPath, 'utf8');
        console.log(`📚 Loaded skills for ${this.name}`);
        
        // Parse key sections from skills.md for runtime access
        this.parseSkillsContent();
      } catch (error) {
        console.warn(`No skills.md found for ${this.name} at ${skillsPath}`);
        this.skillsContent = '';
      }
    } catch (error) {
      console.warn(`Failed to load skills for ${this.name}:`, error.message);
      this.skillsContent = '';
    }
  }

  /**
   * Parse skills content to extract key guidelines and rules
   */
  parseSkillsContent() {
    if (!this.skillsContent) return;
    
    try {
      // Extract NEVER guidelines
      const neverMatch = this.skillsContent.match(/### \*\*NEVER\*\* Do These Things:([\\s\\S]*?)### \*\*ALWAYS\*\* Follow These Principles:/);
      if (neverMatch) {
        this.neverRules = neverMatch[1]
          .split('\\n')
          .filter(line => line.trim().startsWith('**DO NOT**'))
          .map(line => line.replace(/\\d+\\.\\s*\\*\\*DO NOT\\*\\*\\s*/, '').trim());
      }
      
      // Extract ALWAYS guidelines  
      const alwaysMatch = this.skillsContent.match(/### \*\*ALWAYS\*\* Follow These Principles:([\\s\\S]*?)---/);
      if (alwaysMatch) {
        this.alwaysRules = alwaysMatch[1]
          .split('\\n')
          .filter(line => line.trim().startsWith('**'))
          .map(line => line.replace(/\\d+\\.\\s*\\*\\*(.*?)\\*\\*:.*/, '$1').trim());
      }
      
      console.log(`📋 Parsed ${this.neverRules?.length || 0} NEVER rules and ${this.alwaysRules?.length || 0} ALWAYS rules for ${this.name}`);
    } catch (error) {
      console.warn(`Failed to parse skills content for ${this.name}:`, error.message);
    }
  }

  /**
   * Validate proposed action against agent's skills and guidelines
   */
  validateAction(action) {
    if (!this.neverRules) return { valid: true };
    
    // Check if action violates any NEVER rules
    for (const rule of this.neverRules) {
      if (action.includes(rule.toLowerCase()) || rule.toLowerCase().includes(action.toLowerCase())) {
        return {
          valid: false,
          reason: `Violates NEVER rule: DO NOT ${rule}`,
          rule: rule
        };
      }
    }
    
    return { valid: true };
  }
'''
    
    # Insert the skills loading code after the constructor
    insert_point = content.find('  initializeAgent() {')
    if insert_point != -1:
        new_content = content[:insert_point] + skills_loading_code + '\\n  ' + content[insert_point:]
        
        # Also update initializeAgent to call loadSkills
        initialize_replacement = '''  initializeAgent() {
    console.log(`🤖 Agent initialized: ${this.name} (${this.id})`);
    this.loadSkills().catch(console.warn);
  }'''
        
        new_content = new_content.replace(
            '  initializeAgent() {\\n    console.log(`🤖 Agent initialized: ${this.name} (${this.id})`);\\n  }',
            initialize_replacement
        )
        
        with open(base_agent_path, 'w') as f:
            f.write(new_content)
        
        print("✅ Updated BaseAgent.js with skills loading capability")
    else:
        print("❌ Could not find insertion point in BaseAgent.js")

def main():
    """Main function to generate all agent skills files"""
    print("🚀 Business in a Box - Generating Agent Skills Files\\n")
    
    # Create agent skills files
    create_agent_skills_files()
    
    # Update BaseAgent to load skills
    update_base_agent_with_skills_loading()
    
    print("\\n✅ All agent skills files generated successfully!")
    print("\\n📋 Generated skills.md files for:")
    for agent_key in AGENT_DEFINITIONS.keys():
        print(f"   - {agent_key}/skills.md")

if __name__ == "__main__":
    main()

