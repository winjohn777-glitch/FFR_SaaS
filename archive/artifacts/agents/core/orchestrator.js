#!/usr/bin/env node

/**
 * Business in a Box - AI Agent Orchestrator
 * Central coordination system for all AI agents in the development team
 */

const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');

class AgentOrchestrator extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            workspace: process.cwd(),
            agentsDirectory: path.join(process.cwd(), 'agents'),
            reportsDirectory: path.join(process.cwd(), 'agent-reports'),
            maxConcurrentAgents: 5,
            decisionTimeout: 30000, // 30 seconds
            ...config
        };

        this.agents = new Map();
        this.activeProjects = new Map();
        this.decisionQueue = [];
        this.isProcessing = false;

        // Initialize directories
        this.initializeDirectories();
    }

    async initializeDirectories() {
        try {
            await fs.mkdir(this.config.agentsDirectory, {
                recursive: true
            });
            await fs.mkdir(this.config.reportsDirectory, {
                recursive: true
            });
            await fs.mkdir(path.join(this.config.reportsDirectory, 'decisions'), {
                recursive: true
            });
            await fs.mkdir(path.join(this.config.reportsDirectory, 'projects'), {
                recursive: true
            });
        } catch (error) {
            console.error('Failed to initialize directories:', error);
        }
    }

    /**
     * Register an agent in the system
     */
    registerAgent(agent) {
        const agentInfo = {
            id: agent.id,
            type: agent.type,
            capabilities: agent.capabilities,
            status: 'idle',
            lastActivity: new Date(),
            instance: agent
        };

        this.agents.set(agent.id, agentInfo);

        // Listen to agent events
        agent.on('statusChange', (status) => this.handleAgentStatusChange(agent.id, status));
        agent.on('decisionRequested', (decision) => this.handleDecisionRequest(decision));
        agent.on('reportGenerated', (report) => this.handleAgentReport(agent.id, report));

        console.log(`🤖 Agent registered: ${agent.id} (${agent.type})`);
        this.emit('agentRegistered', agentInfo);
    }

    /**
     * Handle agent status changes
     */
    handleAgentStatusChange(agentId, status) {
        const agent = this.agents.get(agentId);
        if (agent) {
            agent.status = status;
            agent.lastActivity = new Date();
            this.emit('agentStatusChanged', {
                agentId,
                status
            });
        }
    }

    /**
     * Handle decision requests from agents
     */
    async handleDecisionRequest(decisionRequest) {
        console.log(`🤔 Decision requested by ${decisionRequest.requester}: ${decisionRequest.type}`);

        // Add to decision queue
        this.decisionQueue.push({
            ...decisionRequest,
            id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            status: 'pending'
        });

        // Process decisions if not already processing
        if (!this.isProcessing) {
            this.processDecisionQueue();
        }
    }

    /**
     * Process the decision queue using appropriate agents
     */
    async processDecisionQueue() {
        if (this.decisionQueue.length === 0) return;

        this.isProcessing = true;

        while (this.decisionQueue.length > 0) {
            const decision = this.decisionQueue.shift();

            try {
                const result = await this.makeDecision(decision);
                decision.status = 'resolved';
                decision.result = result;

                // Notify requesting agent
                const requestingAgent = this.agents.get(decision.requester);
                if (requestingAgent && requestingAgent.instance) {
                    requestingAgent.instance.handleDecision(decision);
                }

                // Log decision
                await this.logDecision(decision);

            } catch (error) {
                console.error(`Decision failed for ${decision.type}:`, error);
                decision.status = 'failed';
                decision.error = error.message;
            }
        }

        this.isProcessing = false;
    }

    /**
     * Make a decision using the appropriate agent hierarchy
     */
    async makeDecision(decision) {
        const {
            type,
            data,
            requester
        } = decision;

        // Route decision to appropriate agent based on type
        let decisionMaker = null;

        switch (type) {
            case 'business_strategy':
            case 'market_analysis':
            case 'roi_assessment':
                decisionMaker = this.getAgentByType('CEO');
                break;

            case 'technical_architecture':
            case 'technology_selection':
            case 'security_strategy':
                decisionMaker = this.getAgentByType('CTO');
                break;

            case 'financial_planning':
            case 'cost_analysis':
            case 'budget_allocation':
                decisionMaker = this.getAgentByType('CFO');
                break;

            case 'operations_optimization':
            case 'process_improvement':
                decisionMaker = this.getAgentByType('COO');
                break;

            case 'compliance_review':
            case 'legal_assessment':
                decisionMaker = this.getAgentByType('Legal');
                break;

            case 'project_planning':
            case 'resource_allocation':
                decisionMaker = this.getAgentByType('ProjectManager');
                break;

            case 'marketing_strategy':
            case 'campaign_planning':
            case 'brand_management':
                decisionMaker = this.getAgentByType('Marketing');
                break;

            case 'sales_strategy':
            case 'lead_qualification':
            case 'revenue_optimization':
                decisionMaker = this.getAgentByType('Sales');
                break;

            case 'seo_strategy':
            case 'organic_optimization':
            case 'keyword_research':
                decisionMaker = this.getAgentByType('SEO');
                break;

            case 'ai_search_optimization':
            case 'voice_search':
            case 'semantic_search':
                decisionMaker = this.getAgentByType('ASEO');
                break;

            case 'google_ai_optimization':
            case 'knowledge_graph':
            case 'bert_optimization':
                decisionMaker = this.getAgentByType('AGO');
                break;

            case 'content_creation':
            case 'content_strategy':
            case 'content_optimization':
            case 'editorial_planning':
                decisionMaker = this.getAgentByType('ContentCreation');
                break;

            case 'video_production':
            case 'video_optimization':
            case 'video_strategy':
                decisionMaker = this.getAgentByType('VideoProduction');
                break;

            case 'audio_production':
            case 'podcast_strategy':
            case 'audio_optimization':
                decisionMaker = this.getAgentByType('AudioProduction');
                break;

            case 'data_analytics':
            case 'business_intelligence':
            case 'performance_analysis':
                decisionMaker = this.getAgentByType('DataAnalytics');
                break;

            case 'customer_support':
            case 'support_optimization':
            case 'customer_experience':
                decisionMaker = this.getAgentByType('CustomerSupport');
                break;

            case 'product_strategy':
            case 'feature_planning':
            case 'product_roadmap':
                decisionMaker = this.getAgentByType('ProductManagement');
                break;

            case 'growth_strategy':
            case 'growth_hacking':
            case 'acquisition_optimization':
                decisionMaker = this.getAgentByType('GrowthHacking');
                break;

            case 'sop_management':
            case 'systems_engineering':
            case 'process_optimization':
            case 'compliance_management':
            case 'sop_design':
            case 'system_integration':
                decisionMaker = this.getAgentByType('SOPSystemsEngineer');
                break;

            default:
                // Default to CTO for technical decisions, CEO for business decisions
                decisionMaker = this.getAgentByType('CTO');
        }

        if (!decisionMaker) {
            throw new Error(`No agent available to handle decision type: ${type}`);
        }

        console.log(`🎯 ${decisionMaker.type} agent making decision: ${type}`);

        // Have the appropriate agent make the decision
        const result = await decisionMaker.instance.makeDecision(decision);

        return {
            decisionId: decision.id,
            decisionMaker: decisionMaker.id,
            result,
            timestamp: new Date()
        };
    }

    /**
     * Get agent by type
     */
    getAgentByType(type) {
        for (const [id, agent] of this.agents) {
            if (agent.type === type && agent.status !== 'offline') {
                return agent;
            }
        }
        return null;
    }

    /**
     * Handle agent reports
     */
    async handleAgentReport(agentId, report) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(
            this.config.reportsDirectory,
            'decisions',
            `${agentId}_${report.type}_${timestamp}.json`
        );

        try {
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
            console.log(`📊 Agent report saved: ${reportPath}`);
        } catch (error) {
            console.error('Failed to save agent report:', error);
        }
    }

    /**
     * Log decisions for audit trail
     */
    async logDecision(decision) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logPath = path.join(
            this.config.reportsDirectory,
            'decisions',
            `decision_${timestamp}.json`
        );

        try {
            await fs.writeFile(logPath, JSON.stringify(decision, null, 2));
        } catch (error) {
            console.error('Failed to log decision:', error);
        }
    }

    /**
     * Create a new project and assign agents
     */
    async createProject(projectSpec) {
        const projectId = `project_${Date.now()}`;

        const project = {
            id: projectId,
            name: projectSpec.name,
            description: projectSpec.description,
            requirements: projectSpec.requirements,
            timeline: projectSpec.timeline,
            budget: projectSpec.budget,
            status: 'planning',
            assignedAgents: [],
            milestones: [],
            startDate: new Date()
        };

        // Assign agents based on project requirements
        await this.assignAgentsToProject(project);

        this.activeProjects.set(projectId, project);

        console.log(`🚀 Project created: ${project.name} (${projectId})`);
        this.emit('projectCreated', project);

        return project;
    }

    /**
     * Assign appropriate agents to a project
     */
    async assignAgentsToProject(project) {
        const {
            requirements
        } = project;

        // Always assign core team
        const coreAgents = ['CEO', 'CTO', 'ProjectManager'];

        for (const agentType of coreAgents) {
            const agent = this.getAgentByType(agentType);
            if (agent) {
                project.assignedAgents.push({
                    agentId: agent.id,
                    role: agentType,
                    status: 'assigned'
                });
            }
        }

        // Assign specialized agents based on requirements
        if (requirements.includes('ui_design') || requirements.includes('user_experience')) {
            const uxAgent = this.getAgentByType('UXUIDesigner');
            if (uxAgent) {
                project.assignedAgents.push({
                    agentId: uxAgent.id,
                    role: 'UXUIDesigner',
                    status: 'assigned'
                });
            }
        }

        if (requirements.includes('testing') || requirements.includes('quality_assurance')) {
            const qaAgent = this.getAgentByType('QALead');
            const testAgent = this.getAgentByType('BrowserAutomation');

            if (qaAgent) {
                project.assignedAgents.push({
                    agentId: qaAgent.id,
                    role: 'QALead',
                    status: 'assigned'
                });
            }

            if (testAgent) {
                project.assignedAgents.push({
                    agentId: testAgent.id,
                    role: 'BrowserAutomation',
                    status: 'assigned'
                });
            }
        }

        if (requirements.includes('financial_analysis') || requirements.includes('budget_management')) {
            const cfoAgent = this.getAgentByType('CFO');
            if (cfoAgent) {
                project.assignedAgents.push({
                    agentId: cfoAgent.id,
                    role: 'CFO',
                    status: 'assigned'
                });
            }
        }

        // Assign content and marketing agents based on requirements
        if (requirements.includes('content_creation') || requirements.includes('marketing') || requirements.includes('seo')) {
            const contentAgent = this.getAgentByType('ContentCreation');
            const marketingAgent = this.getAgentByType('Marketing');
            const seoAgent = this.getAgentByType('SEO');
            const aseoAgent = this.getAgentByType('ASEO');
            const agoAgent = this.getAgentByType('AGO');

            if (contentAgent) {
                project.assignedAgents.push({
                    agentId: contentAgent.id,
                    role: 'ContentCreation',
                    status: 'assigned'
                });
            }

            if (marketingAgent) {
                project.assignedAgents.push({
                    agentId: marketingAgent.id,
                    role: 'Marketing',
                    status: 'assigned'
                });
            }

            if (seoAgent) {
                project.assignedAgents.push({
                    agentId: seoAgent.id,
                    role: 'SEO',
                    status: 'assigned'
                });
            }

            if (aseoAgent) {
                project.assignedAgents.push({
                    agentId: aseoAgent.id,
                    role: 'ASEO',
                    status: 'assigned'
                });
            }

            if (agoAgent) {
                project.assignedAgents.push({
                    agentId: agoAgent.id,
                    role: 'AGO',
                    status: 'assigned'
                });
            }
        }

        if (requirements.includes('sales') || requirements.includes('revenue_generation')) {
            const salesAgent = this.getAgentByType('Sales');
            if (salesAgent) {
                project.assignedAgents.push({
                    agentId: salesAgent.id,
                    role: 'Sales',
                    status: 'assigned'
                });
            }
        }
    }

    /**
     * Get system status
     */
    getStatus() {
        const agentStatus = {};
        for (const [id, agent] of this.agents) {
            agentStatus[id] = {
                type: agent.type,
                status: agent.status,
                lastActivity: agent.lastActivity
            };
        }

        return {
            totalAgents: this.agents.size,
            activeProjects: this.activeProjects.size,
            pendingDecisions: this.decisionQueue.length,
            agentStatus,
            projects: Array.from(this.activeProjects.values())
        };
    }

    /**
     * Start the orchestrator
     */
    async start() {
        console.log('🚀 Business in a Box Orchestrator starting...');

        // Load existing agents
        await this.loadAgents();

        // Start decision processing
        setInterval(() => {
            if (!this.isProcessing && this.decisionQueue.length > 0) {
                this.processDecisionQueue();
            }
        }, 1000);

        console.log('✅ Business in a Box Orchestrator started');
    }

    /**
     * Load agents from the agents directory
     */
    async loadAgents() {
        try {
            const agentsDir = this.config.agentsDirectory;
            const entries = await fs.readdir(agentsDir, {
                withFileTypes: true
            });

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const agentPath = path.join(agentsDir, entry.name, 'index.js');
                    try {
                        const AgentClass = require(agentPath);
                        const agent = new AgentClass.default || new AgentClass();
                        this.registerAgent(agent);
                    } catch (error) {
                        console.warn(`Failed to load agent ${entry.name}:`, error.message);
                    }
                }
            }
        } catch (error) {
            console.warn('No existing agents to load:', error.message);
        }
    }
}

module.exports = AgentOrchestrator;

// If running directly, start the orchestrator
if (require.main === module) {
    const orchestrator = new AgentOrchestrator();
    orchestrator.start().catch(console.error);
}