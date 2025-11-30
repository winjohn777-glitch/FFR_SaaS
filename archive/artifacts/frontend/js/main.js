// Florida First Roofing - Construction Accounting System JavaScript

class FloridaFirstRoofingApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5001/api';
        this.authToken = localStorage.getItem('authToken');
        this.currentUser = null;
        this.currentSection = 'login';

        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthentication();
        this.updateDashboardStats();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.showSection(tab);
            });
        });

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Customer management
        const addCustomerBtn = document.getElementById('add-customer-btn');
        if (addCustomerBtn) {
            addCustomerBtn.addEventListener('click', () => this.showCustomerModal());
        }

        const customerForm = document.getElementById('customer-form');
        if (customerForm) {
            customerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCustomerSubmit();
            });
        }

        // Project management
        const addProjectBtn = document.getElementById('add-project-btn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => this.showProjectModal());
        }

        // SOP workflow
        const triggerSopBtn = document.getElementById('trigger-sop-btn');
        if (triggerSopBtn) {
            triggerSopBtn.addEventListener('click', () => this.showSopModal());
        }

        const sopForm = document.getElementById('sop-form');
        if (sopForm) {
            sopForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSopTrigger();
            });
        }

        // Analytics refresh
        const refreshAnalyticsBtn = document.getElementById('refresh-analytics-btn');
        if (refreshAnalyticsBtn) {
            refreshAnalyticsBtn.addEventListener('click', () => this.refreshAnalytics());
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Customer search
        const customerSearch = document.getElementById('customer-search');
        if (customerSearch) {
            customerSearch.addEventListener('input', (e) => {
                this.searchCustomers(e.target.value);
            });
        }

        // Project filters
        const statusFilter = document.getElementById('project-status-filter');
        const typeFilter = document.getElementById('project-type-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterProjects());
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterProjects());
        }
    }

    async checkAuthentication() {
        if (!this.authToken) {
            this.showSection('login');
            return;
        }

        try {
            // Verify token with a simple request
            const response = await fetch(`${this.apiBaseUrl}/integration/analytics/integration`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            if (response.ok) {
                this.showSection('dashboard');
                this.loadDashboardData();
            } else {
                this.handleLogout();
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            this.handleLogout();
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.authToken = data.token;
                this.currentUser = data.user;
                localStorage.setItem('authToken', this.authToken);

                document.getElementById('user-name').textContent = this.currentUser.name;
                this.showSection('dashboard');
                this.loadDashboardData();
                this.showToast('Login successful!', 'success');
            } else {
                errorDiv.textContent = data.message || 'Login failed';
                errorDiv.classList.add('show');
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = 'Connection error. Please try again.';
            errorDiv.classList.add('show');
        } finally {
            this.showLoading(false);
        }
    }

    handleLogout() {
        this.authToken = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        this.showSection('login');
        this.showToast('Logged out successfully', 'success');
    }

    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        const targetBtn = document.querySelector(`[data-tab="${sectionName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'customers':
                this.loadCustomers();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'sop':
                this.loadWorkflows();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    async loadDashboardData() {
        try {
            const [customersRes, projectsRes, workflowsRes] = await Promise.all([
                fetch(`${this.apiBaseUrl}/integration/customers`, {
                    headers: { 'Authorization': `Bearer ${this.authToken}` }
                }),
                fetch(`${this.apiBaseUrl}/integration/projects`, {
                    headers: { 'Authorization': `Bearer ${this.authToken}` }
                }),
                fetch(`${this.apiBaseUrl}/integration/sop/workflows`, {
                    headers: { 'Authorization': `Bearer ${this.authToken}` }
                })
            ]);

            // Update dashboard stats (simplified for demo)
            document.getElementById('total-customers').textContent = '15';
            document.getElementById('active-projects').textContent = '8';
            document.getElementById('active-workflows').textContent = '12';
            document.getElementById('notifications-count').textContent = '3';

            this.loadRecentActivities();
            this.loadProjectChart();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    loadRecentActivities() {
        const activitiesDiv = document.getElementById('recent-activities');
        if (activitiesDiv) {
            activitiesDiv.innerHTML = `
                <div style="padding: 1rem; text-align: center; color: #64748b;">
                    <i class="fas fa-clock"></i>
                    <p>Recent activities will appear here</p>
                </div>
            `;
        }
    }

    loadProjectChart() {
        const canvas = document.getElementById('project-chart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#1e40af';
            ctx.fillRect(50, 50, 100, 100);
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.fillText('Chart Placeholder', 60, 110);
        }
    }

    async loadCustomers() {
        try {
            this.showLoading(true);
            // Simulate customer data for demo
            const customers = [
                {
                    id: 1,
                    customerNumber: 'CUST-001',
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john.smith@email.com',
                    phone: '407-555-0123',
                    county: 'Orange',
                    status: 'Active'
                },
                {
                    id: 2,
                    customerNumber: 'CUST-002',
                    firstName: 'Sarah',
                    lastName: 'Johnson',
                    email: 'sarah.johnson@email.com',
                    phone: '407-555-0456',
                    county: 'Brevard',
                    status: 'Active'
                }
            ];

            this.displayCustomers(customers);
        } catch (error) {
            console.error('Failed to load customers:', error);
        } finally {
            this.showLoading(false);
        }
    }

    displayCustomers(customers) {
        const tbody = document.getElementById('customers-list');
        if (!tbody) return;

        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.customerNumber}</td>
                <td>${customer.firstName} ${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.county}</td>
                <td>
                    <span class="project-status ${customer.status.toLowerCase()}">${customer.status}</span>
                </td>
                <td>
                    <button class="btn-secondary" onclick="app.editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadProjects() {
        try {
            this.showLoading(true);
            // Simulate project data for demo
            const projects = [
                {
                    id: 1,
                    name: 'Orlando Roof Replacement',
                    type: 'roof-replacement',
                    status: 'active',
                    customer: 'John Smith',
                    estimatedValue: 15000,
                    address: '123 Main St, Orlando, FL'
                },
                {
                    id: 2,
                    name: 'Commercial Repair - Downtown',
                    type: 'commercial',
                    status: 'estimation',
                    customer: 'ABC Corp',
                    estimatedValue: 25000,
                    address: '456 Business Blvd, Orlando, FL'
                }
            ];

            this.displayProjects(projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            this.showLoading(false);
        }
    }

    displayProjects(projects) {
        const container = document.getElementById('projects-list');
        if (!container) return;

        container.innerHTML = projects.map(project => `
            <div class="project-card">
                <h3>${project.name}</h3>
                <div class="project-meta">
                    <span>${project.customer}</span>
                    <span class="project-status ${project.status}">${project.status}</span>
                </div>
                <p><i class="fas fa-map-marker-alt"></i> ${project.address}</p>
                <p><i class="fas fa-dollar-sign"></i> $${project.estimatedValue.toLocaleString()}</p>
                <div style="margin-top: 1rem;">
                    <button class="btn-primary" onclick="app.viewProject(${project.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadWorkflows() {
        try {
            this.showLoading(true);
            // Simulate workflow data for demo
            const workflows = [
                {
                    workflowId: 'WF-123456',
                    sopId: 'SOP-4001',
                    status: 'active',
                    urgency: 'high',
                    createdAt: new Date().toISOString()
                }
            ];

            this.displayWorkflows(workflows);
        } catch (error) {
            console.error('Failed to load workflows:', error);
        } finally {
            this.showLoading(false);
        }
    }

    displayWorkflows(workflows) {
        const container = document.getElementById('workflows-list');
        if (!container) return;

        if (workflows.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #64748b;">
                    <i class="fas fa-clipboard-list" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>No active workflows</p>
                </div>
            `;
            return;
        }

        container.innerHTML = workflows.map(workflow => `
            <div style="border: 1px solid #e2e8f0; border-radius: 0.375rem; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${workflow.sopId}</strong>
                        <span style="margin-left: 1rem; color: #64748b;">${workflow.workflowId}</span>
                    </div>
                    <span class="project-status ${workflow.urgency}">${workflow.urgency}</span>
                </div>
                <div style="margin-top: 0.5rem; color: #64748b; font-size: 0.875rem;">
                    Status: ${workflow.status} | Created: ${new Date(workflow.createdAt).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    }

    async loadAnalytics() {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiBaseUrl}/integration/analytics/integration`, {
                headers: { 'Authorization': `Bearer ${this.authToken}` }
            });

            if (response.ok) {
                const data = await response.json();
                this.displayAnalytics(data.analytics);
            } else {
                throw new Error('Failed to load analytics');
            }
        } catch (error) {
            console.error('Failed to load analytics:', error);
            this.showToast('Failed to load analytics data', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayAnalytics(analytics) {
        const leadTrendsChart = document.getElementById('lead-trends-chart');
        if (leadTrendsChart) {
            const ctx = leadTrendsChart.getContext('2d');
            ctx.fillStyle = '#1e40af';
            ctx.fillRect(50, 50, 200, 100);
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.fillText('Lead Trends Chart', 100, 110);
        }

        // Display SOP performance
        const sopPerformance = document.getElementById('sop-performance');
        if (sopPerformance && analytics.sopPerformance) {
            sopPerformance.innerHTML = analytics.sopPerformance.map(sop => `
                <div style="border-bottom: 1px solid #e2e8f0; padding: 0.75rem 0;">
                    <div style="font-weight: 500;">${sop.sop_id}</div>
                    <div style="color: #64748b; font-size: 0.875rem;">
                        Triggered: ${sop.triggered_count} times |
                        Avg Time: ${sop.avg_completion_time_hours}h
                    </div>
                </div>
            `).join('');
        }
    }

    showCustomerModal() {
        const modal = document.getElementById('customer-modal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('customer-form').reset();
        }
    }

    showSopModal() {
        const modal = document.getElementById('sop-modal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('sop-form').reset();
        }
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    async handleCustomerSubmit() {
        const formData = new FormData(document.getElementById('customer-form'));
        const customerData = Object.fromEntries(formData);

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBaseUrl}/integration/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    leadId: `LEAD-${Date.now()}`,
                    customerNumber: `CUST-${String(Date.now()).slice(-3)}`,
                    ...customerData,
                    totalValue: 0,
                    status: 'active'
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Customer created successfully!', 'success');
                this.closeModals();
                this.loadCustomers();
            } else {
                this.showToast(data.message || 'Failed to create customer', 'error');
            }
        } catch (error) {
            console.error('Customer creation error:', error);
            this.showToast('Connection error. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleSopTrigger() {
        const formData = new FormData(document.getElementById('sop-form'));
        const sopData = Object.fromEntries(formData);

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBaseUrl}/integration/sop/workflows/trigger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    sopId: sopData.sopId,
                    leadId: `LEAD-${Date.now()}`,
                    urgency: sopData.urgency,
                    serviceType: sopData.serviceType,
                    metadata: {
                        source: 'manual',
                        automated: false
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showToast(`SOP workflow ${data.workflowId} triggered successfully!`, 'success');
                this.closeModals();
                this.loadWorkflows();
            } else {
                this.showToast(data.message || 'Failed to trigger SOP workflow', 'error');
            }
        } catch (error) {
            console.error('SOP trigger error:', error);
            this.showToast('Connection error. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    searchCustomers(query) {
        // Simple client-side search for demo
        const rows = document.querySelectorAll('#customers-list tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const visible = text.includes(query.toLowerCase());
            row.style.display = visible ? '' : 'none';
        });
    }

    filterProjects() {
        const statusFilter = document.getElementById('project-status-filter').value;
        const typeFilter = document.getElementById('project-type-filter').value;

        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const status = card.querySelector('.project-status').textContent;
            const visible = (!statusFilter || status === statusFilter) &&
                          (!typeFilter || card.textContent.includes(typeFilter));
            card.style.display = visible ? '' : 'none';
        });
    }

    async refreshAnalytics() {
        this.showToast('Refreshing analytics data...', 'success');
        await this.loadAnalytics();
    }

    async updateDashboardStats() {
        // Simulate periodic updates
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                const notificationCount = document.getElementById('notifications-count');
                if (notificationCount) {
                    const currentCount = parseInt(notificationCount.textContent);
                    if (Math.random() > 0.8) { // 20% chance to add notification
                        notificationCount.textContent = currentCount + 1;
                    }
                }
            }
        }, 30000); // Update every 30 seconds
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Utility methods for button actions
    editCustomer(customerId) {
        this.showToast(`Edit customer ${customerId} (feature coming soon)`, 'warning');
    }

    viewProject(projectId) {
        this.showToast(`View project ${projectId} details (feature coming soon)`, 'warning');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FloridaFirstRoofingApp();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                window.app?.showSection('dashboard');
                break;
            case '2':
                e.preventDefault();
                window.app?.showSection('customers');
                break;
            case '3':
                e.preventDefault();
                window.app?.showSection('projects');
                break;
            case '4':
                e.preventDefault();
                window.app?.showSection('sop');
                break;
            case '5':
                e.preventDefault();
                window.app?.showSection('analytics');
                break;
        }
    }
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Trigger chart redraws if needed
    if (window.app && window.app.currentSection === 'dashboard') {
        window.app.loadProjectChart();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FloridaFirstRoofingApp;
}