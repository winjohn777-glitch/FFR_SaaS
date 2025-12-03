import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useData } from '../contexts/DataContext';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  Search,
  Filter,
  Play,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  Star,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

// Styled Components
const TrainingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatIcon = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ color, theme }) => color || theme.colors.primary}20;
  color: ${({ color, theme }) => color || theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.875rem;
  color: ${({ positive, theme }) => 
    positive === undefined 
      ? theme.colors.text.secondary 
      : positive 
        ? theme.colors.secondary 
        : theme.colors.accent
  };
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ControlsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 3rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.light};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const QuickActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
  }

  &.secondary {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      background-color: ${({ theme }) => theme.colors.border};
    }
  }
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CourseCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CourseHeader = styled.div<{ category: string }>`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ category, theme }) => {
    switch (category) {
      case 'Safety':
        return `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accent}cc)`;
      case 'Technical':
        return `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary}cc)`;
      case 'Business':
        return `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.secondary}cc)`;
      case 'Certifications':
        return `linear-gradient(135deg, ${theme.colors.roofing.tile}, ${theme.colors.roofing.tile}cc)`;
      default:
        return `linear-gradient(135deg, ${theme.colors.roofing.metal}, ${theme.colors.roofing.metal}cc)`;
    }
  }};
  color: white;
  position: relative;
`;

const CourseCategory = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CourseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CourseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  opacity: 0.9;
`;

const CourseContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CourseDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number; category: string }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ category, theme }) => {
    switch (category) {
      case 'Safety':
        return theme.colors.accent;
      case 'Technical':
        return theme.colors.primary;
      case 'Business':
        return theme.colors.secondary;
      case 'Certifications':
        return theme.colors.roofing.tile;
      default:
        return theme.colors.roofing.metal;
    }
  }};
  transition: width 0.3s ease;
`;

const CourseFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourseStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return `
          background-color: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
        `;
      case 'in-progress':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'required':
        return `
          background-color: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
        `;
      default:
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const CourseActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionIcon = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Types
interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Safety' | 'Technical' | 'Business' | 'Certifications';
  duration: number; // in hours
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed' | 'required';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  rating: number;
  enrolledStudents: number;
  lastUpdated: string;
  isRequired: boolean;
  certificateAvailable: boolean;
  expirationMonths?: number;
}

// Mock Data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'OSHA Fall Protection Standards',
    description: 'Comprehensive training on OSHA fall protection requirements for roofing work. Covers proper equipment, setup procedures, and safety protocols.',
    category: 'Safety',
    duration: 4,
    progress: 100,
    status: 'completed',
    difficulty: 'Beginner',
    instructor: 'Safety Director',
    rating: 4.8,
    enrolledStudents: 24,
    lastUpdated: '2024-01-15',
    isRequired: true,
    certificateAvailable: true,
    expirationMonths: 12
  },
  {
    id: '2',
    title: 'Shingle Installation Techniques',
    description: 'Master the art of professional shingle installation. Learn proper techniques, tools, and quality control measures for various shingle types.',
    category: 'Technical',
    duration: 6,
    progress: 75,
    status: 'in-progress',
    difficulty: 'Intermediate',
    instructor: 'Master Roofer',
    rating: 4.9,
    enrolledStudents: 18,
    lastUpdated: '2024-02-01',
    isRequired: false,
    certificateAvailable: true
  },
  {
    id: '3',
    title: 'Customer Service Excellence',
    description: 'Develop exceptional customer service skills specific to the roofing industry. Handle complaints, manage expectations, and build lasting relationships.',
    category: 'Business',
    duration: 3,
    progress: 45,
    status: 'in-progress',
    difficulty: 'Beginner',
    instructor: 'Business Manager',
    rating: 4.6,
    enrolledStudents: 32,
    lastUpdated: '2024-01-28',
    isRequired: true,
    certificateAvailable: false
  },
  {
    id: '4',
    title: 'Florida State Roofing License',
    description: 'Prepare for the Florida state roofing license examination. Covers regulations, codes, and business practices required for certification.',
    category: 'Certifications',
    duration: 8,
    progress: 0,
    status: 'not-started',
    difficulty: 'Advanced',
    instructor: 'License Specialist',
    rating: 4.7,
    enrolledStudents: 12,
    lastUpdated: '2024-02-05',
    isRequired: true,
    certificateAvailable: true,
    expirationMonths: 24
  },
  {
    id: '5',
    title: 'Metal Roofing Installation',
    description: 'Specialized training for metal roofing systems. Learn cutting techniques, fastening methods, and weatherproofing for commercial and residential applications.',
    category: 'Technical',
    duration: 5,
    progress: 30,
    status: 'in-progress',
    difficulty: 'Advanced',
    instructor: 'Metal Specialist',
    rating: 4.8,
    enrolledStudents: 15,
    lastUpdated: '2024-01-20',
    isRequired: false,
    certificateAvailable: true
  },
  {
    id: '6',
    title: 'PPE and Safety Equipment',
    description: 'Complete guide to Personal Protective Equipment selection, maintenance, and proper usage in roofing environments.',
    category: 'Safety',
    duration: 2,
    progress: 100,
    status: 'completed',
    difficulty: 'Beginner',
    instructor: 'Safety Director',
    rating: 4.9,
    enrolledStudents: 28,
    lastUpdated: '2024-01-10',
    isRequired: true,
    certificateAvailable: true,
    expirationMonths: 6
  },
  {
    id: '7',
    title: 'Project Estimation and Pricing',
    description: 'Learn accurate estimation techniques for roofing projects. Understand material costs, labor calculations, and competitive pricing strategies.',
    category: 'Business',
    duration: 4,
    progress: 0,
    status: 'not-started',
    difficulty: 'Intermediate',
    instructor: 'Estimator',
    rating: 4.5,
    enrolledStudents: 22,
    lastUpdated: '2024-02-08',
    isRequired: false,
    certificateAvailable: false
  },
  {
    id: '8',
    title: 'Tile Roofing Systems',
    description: 'Comprehensive training on clay and concrete tile installation. Covers underlayment, tile placement, ridge details, and repairs.',
    category: 'Technical',
    duration: 6,
    progress: 60,
    status: 'in-progress',
    difficulty: 'Intermediate',
    instructor: 'Tile Expert',
    rating: 4.7,
    enrolledStudents: 14,
    lastUpdated: '2024-01-25',
    isRequired: false,
    certificateAvailable: true
  }
];

const Training: React.FC = () => {
  // Get training sessions from DataContext
  const { getUpcomingTrainingSessions } = useData();
  const upcomingTrainingSessions = getUpcomingTrainingSessions();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return mockCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
      const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
    });
  }, [searchTerm, categoryFilter, statusFilter, difficultyFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCourses = mockCourses.length;
    const completedCourses = mockCourses.filter(c => c.status === 'completed').length;
    const inProgressCourses = mockCourses.filter(c => c.status === 'in-progress').length;
    const requiredCourses = mockCourses.filter(c => c.isRequired).length;
    const requiredCompleted = mockCourses.filter(c => c.isRequired && c.status === 'completed').length;
    const totalHours = mockCourses.reduce((acc, course) => acc + (course.duration * course.progress / 100), 0);
    const certificatesEarned = mockCourses.filter(c => c.status === 'completed' && c.certificateAvailable).length;

    return {
      completionRate: Math.round((completedCourses / totalCourses) * 100),
      inProgress: inProgressCourses,
      totalHours: Math.round(totalHours * 10) / 10,
      certificatesEarned,
      requiredCompliance: Math.round((requiredCompleted / requiredCourses) * 100)
    };
  }, []);

  return (
    <TrainingContainer>
      <HeaderSection>
        <HeaderContent>
          <PageTitle>
            <GraduationCap size={32} />
            Training & Learning Management
          </PageTitle>
          <PageSubtitle>
            Advance your roofing expertise with comprehensive training programs and professional certifications
          </PageSubtitle>
        </HeaderContent>
      </HeaderSection>

      {/* Upcoming Training Sessions */}
      {upcomingTrainingSessions.length > 0 && (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '0 0 20px 0',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            <Calendar size={20} />
            Upcoming Training Sessions ({upcomingTrainingSessions.length})
          </h3>
          <div style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
          }}>
            {upcomingTrainingSessions.slice(0, 6).map((session) => (
              <div key={session.id} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h4 style={{
                    margin: '0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    {session.type}
                  </h4>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    backgroundColor: session.priority === 'high' ? '#fef2f2' :
                                   session.priority === 'medium' ? '#fff7ed' : '#f0f9ff',
                    color: session.priority === 'high' ? '#dc2626' :
                           session.priority === 'medium' ? '#ea580c' : '#2563eb'
                  }}>
                    {session.priority}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '8px',
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={14} />
                    {session.employeeName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} />
                    {new Date(session.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} />
                    {session.time} ({session.duration})
                  </div>
                  {session.location && (
                    <div>📍 {session.location}</div>
                  )}
                  {session.instructor && (
                    <div>👨‍🏫 {session.instructor}</div>
                  )}
                </div>

                {session.notes && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#475569',
                    fontStyle: 'italic',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '8px'
                  }}>
                    {session.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
          {upcomingTrainingSessions.length > 6 && (
            <div style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              + {upcomingTrainingSessions.length - 6} more upcoming sessions
            </div>
          )}
        </div>
      )}

      {/* Statistics Overview */}
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Course Completion</StatTitle>
            <StatIcon color="#059669">
              <CheckCircle size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.completionRate}%</StatValue>
          <StatChange positive={stats.completionRate > 70}>
            <TrendingUp size={16} />
            {mockCourses.filter(c => c.status === 'completed').length} of {mockCourses.length} completed
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Active Courses</StatTitle>
            <StatIcon color="#1e40af">
              <BookOpen size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.inProgress}</StatValue>
          <StatChange>
            <Clock size={16} />
            Currently enrolled
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Training Hours</StatTitle>
            <StatIcon color="#8b4513">
              <Clock size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalHours}h</StatValue>
          <StatChange>
            <BarChart3 size={16} />
            Hours completed
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Certificates Earned</StatTitle>
            <StatIcon color="#dc2626">
              <Award size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.certificatesEarned}</StatValue>
          <StatChange positive={stats.certificatesEarned > 0}>
            <Award size={16} />
            Professional certifications
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Compliance Rate</StatTitle>
            <StatIcon color="#cd853f">
              <AlertTriangle size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.requiredCompliance}%</StatValue>
          <StatChange positive={stats.requiredCompliance > 80}>
            <CheckCircle size={16} />
            Required training compliance
          </StatChange>
        </StatCard>
      </StatsGrid>

      {/* Search and Filter Controls */}
      <ControlsSection>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search courses, instructors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <FilterContainer>
          <FilterSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Safety">Safety</option>
            <option value="Technical">Technical</option>
            <option value="Business">Business</option>
            <option value="Certifications">Certifications</option>
          </FilterSelect>

          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="required">Required</option>
          </FilterSelect>

          <FilterSelect
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </FilterSelect>
        </FilterContainer>

        <QuickActionsContainer>
          <ActionButton>
            <Play size={16} />
            Continue Learning
          </ActionButton>
          <ActionButton className="secondary">
            <Download size={16} />
            My Certificates
          </ActionButton>
        </QuickActionsContainer>
      </ControlsSection>

      {/* Courses Grid */}
      <CoursesGrid>
        {filteredCourses.map((course) => (
          <CourseCard key={course.id}>
            <CourseHeader category={course.category}>
              <CourseCategory>{course.category}</CourseCategory>
              <CourseTitle>{course.title}</CourseTitle>
              <CourseMeta>
                <span>
                  <Clock size={14} style={{ marginRight: '4px' }} />
                  {course.duration}h
                </span>
                <span>
                  <Users size={14} style={{ marginRight: '4px' }} />
                  {course.enrolledStudents}
                </span>
                <span>
                  <Star size={14} style={{ marginRight: '4px' }} />
                  {course.rating}
                </span>
              </CourseMeta>
            </CourseHeader>

            <CourseContent>
              <CourseDescription>{course.description}</CourseDescription>

              <ProgressSection>
                <ProgressLabel>
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </ProgressLabel>
                <ProgressBar>
                  <ProgressFill progress={course.progress} category={course.category} />
                </ProgressBar>
              </ProgressSection>

              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                <div>Instructor: {course.instructor}</div>
                <div>Difficulty: {course.difficulty}</div>
                <div>Last Updated: {new Date(course.lastUpdated).toLocaleDateString()}</div>
                {course.expirationMonths && (
                  <div>Certificate Valid: {course.expirationMonths} months</div>
                )}
              </div>
            </CourseContent>

            <CourseFooter>
              <CourseStatus status={course.status}>
                {course.isRequired ? 'Required' : course.status.replace('-', ' ')}
              </CourseStatus>
              <CourseActions>
                <ActionIcon title="View Details">
                  <Eye size={16} />
                </ActionIcon>
                {course.certificateAvailable && course.status === 'completed' && (
                  <ActionIcon title="Download Certificate">
                    <Download size={16} />
                  </ActionIcon>
                )}
                <ActionIcon title="Start/Continue Course">
                  <Play size={16} />
                </ActionIcon>
              </CourseActions>
            </CourseFooter>
          </CourseCard>
        ))}
      </CoursesGrid>

      {filteredCourses.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#64748b'
        }}>
          <BookOpen size={48} style={{ marginBottom: '1rem' }} />
          <h3>No courses found</h3>
          <p>Try adjusting your search terms or filters to find relevant training content.</p>
        </div>
      )}
    </TrainingContainer>
  );
};

export default Training;