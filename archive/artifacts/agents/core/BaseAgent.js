/**
 * Base Agent Class for Business in a Box AI Agents
 * Provides common functionality for all agents in the system
 */

const EventEmitter = require('events');

class BaseAgent extends EventEmitter {
    constructor(config = {}) {
        super();

        this.id = config.id || `${this.constructor.name}_${Date.now()}`;
        this.type = config.type || this.constructor.name;
        this.name = config.name || this.constructor.name;

        this.capabilities = config.capabilities || [];
        this.tools = config.tools || [];
        this.status = 'idle';
        this.metrics = {
            decisionsMade: 0,
            tasksCompleted: 0,
            errorsEncountered: 0,
            averageResponseTime: 0
        };

        this.initializeAgent();
    }

    /**
     * Initialize the agent - override in subclasses
     */
    initializeAgent() {
        console.log(`🤖 Agent initialized: ${this.name} (${this.id})`);
        this.loadSkills().catch(console.warn);
    }

    /**
     * Load agent-specific skills and guidelines from skills.md
     */
    async loadSkills() {
        try {
            const fs = require('fs').promises;
            const path = require('path');

            // Determine agent directory based on agent type
            const agentType = this.type.toLowerCase().replace(' agent', '').replace('agent', '').trim();
            const agentDir = path.join(__dirname, '..', agentType);
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
                this.neverRules = [];
                this.alwaysRules = [];
            }
        } catch (error) {
            console.warn(`Failed to load skills for ${this.name}:`, error.message);
            this.skillsContent = '';
            this.neverRules = [];
            this.alwaysRules = [];
        }
    }

    /**
     * Parse skills content to extract key guidelines and rules
     */
    parseSkillsContent() {
        if (!this.skillsContent) return;

        try {
            // Extract NEVER guidelines
            const neverMatch = this.skillsContent.match(/### \*\*NEVER\*\* Do These Things:([\s\S]*?)### \*\*ALWAYS\*\* Follow These Principles:/);
            if (neverMatch) {
                this.neverRules = neverMatch[1]
                    .split('\n')
                    .filter(line => line.trim().startsWith('**DO NOT**'))
                    .map(line => line.replace(/\d+\.\s*\*\*DO NOT\*\*\s*/, '').trim())
                    .filter(rule => rule.length > 0);
            }

            // Extract ALWAYS guidelines  
            const alwaysMatch = this.skillsContent.match(/### \*\*ALWAYS\*\* Follow These Principles:([\s\S]*?)---/);
            if (alwaysMatch) {
                this.alwaysRules = alwaysMatch[1]
                    .split('\n')
                    .filter(line => line.trim().startsWith('**'))
                    .map(line => line.replace(/\d+\.\s*\*\*(.*?)\*\*:.*/, '$1').trim())
                    .filter(rule => rule.length > 0);
            }

            console.log(`📋 Parsed ${this.neverRules?.length || 0} NEVER rules and ${this.alwaysRules?.length || 0} ALWAYS rules for ${this.name}`);
        } catch (error) {
            console.warn(`Failed to parse skills content for ${this.name}:`, error.message);
            this.neverRules = [];
            this.alwaysRules = [];
        }
    }

    /**
     * Validate proposed action against agent's skills and guidelines
     */
    validateAction(action) {
        if (!this.neverRules || this.neverRules.length === 0) return {
            valid: true
        };

        // Check if action violates any NEVER rules
        for (const rule of this.neverRules) {
            if (rule && (action.toLowerCase().includes(rule.toLowerCase()) || rule.toLowerCase().includes(action.toLowerCase()))) {
                return {
                    valid: false,
                    reason: `Violates NEVER rule: DO NOT ${rule}`,
                    rule: rule
                };
            }
        }

        return {
            valid: true
        };
    }

    /**
     * Update agent status
     */
    setStatus(status) {
        const previousStatus = this.status;
        this.status = status;
        this.emit('statusChange', status, previousStatus);
    }

    /**
     * Request a decision from the orchestrator
     */
    requestDecision(decisionType, data, options = {}) {
        const decision = {
            id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: decisionType,
            data,
            requester: this.id,
            timestamp: new Date(),
            priority: options.priority || 'normal',
            timeout: options.timeout || 30000
        };

        this.emit('decisionRequested', decision);
        return decision;
    }

    /**
     * Handle decisions made by other agents
     */
    handleDecision(decision) {
        console.log(`📋 ${this.name} received decision: ${decision.type}`);
        this.emit('decisionHandled', decision);
    }

    /**
     * Generate and emit a report
     */
    generateReport(type, content, metadata = {}) {
        const report = {
            id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            agentId: this.id,
            agentName: this.name,
            type,
            content,
            metadata,
            timestamp: new Date()
        };

        this.emit('reportGenerated', report);
        return report;
    }

    /**
     * Make a decision based on agent type and capabilities
     */
    async makeDecision(decisionRequest) {
        const startTime = Date.now();

        try {
            this.setStatus('deciding');

            // Override in subclasses for specific decision logic
            const result = await this.processDecision(decisionRequest);

            this.metrics.decisionsMade++;
            this.metrics.averageResponseTime =
                (this.metrics.averageResponseTime * (this.metrics.decisionsMade - 1) +
                    (Date.now() - startTime)) / this.metrics.decisionsMade;

            this.setStatus('idle');
            return result;

        } catch (error) {
            this.metrics.errorsEncountered++;
            this.setStatus('error');
            console.error(`Decision failed for ${this.name}:`, error);
            throw error;
        }
    }

    /**
     * Process decision - override in subclasses
     */
    async processDecision(decisionRequest) {
        throw new Error(`processDecision not implemented in ${this.constructor.name}`);
    }

    /**
     * Execute a task
     */
    async executeTask(task) {
        const startTime = Date.now();

        try {
            this.setStatus('working');

            const result = await this.performTask(task);

            this.metrics.tasksCompleted++;
            this.setStatus('idle');

            return result;

        } catch (error) {
            this.metrics.errorsEncountered++;
            this.setStatus('error');
            throw error;
        }
    }

    /**
     * Perform task - override in subclasses
     */
    async performTask(task) {
        throw new Error(`performTask not implemented in ${this.constructor.name}`);
    }

    /**
     * Get agent capabilities and status
     */
    getInfo() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            status: this.status,
            capabilities: this.capabilities,
            tools: this.tools,
            metrics: this.metrics
        };
    }

    /**
     * Log an activity
     */
    logActivity(activity, details = {}) {
        const logEntry = {
            timestamp: new Date(),
            agentId: this.id,
            activity,
            details
        };

        this.emit('activityLogged', logEntry);
        return logEntry;
    }

    /**
     * Validate input data
     */
    validateInput(data, schema) {
        // Basic validation - can be enhanced based on needs
        if (!data) {
            throw new Error('Input data is required');
        }

        if (schema && schema.required) {
            for (const field of schema.required) {
                if (!data[field]) {
                    throw new Error(`Required field missing: ${field}`);
                }
            }
        }

        return true;
    }
}

module.exports = BaseAgent;