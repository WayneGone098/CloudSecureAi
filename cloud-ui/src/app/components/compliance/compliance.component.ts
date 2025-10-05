import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ComplianceCheck {
  id: string;
  title: string;
  framework: string;
  provider: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'PENDING';
  lastScan: Date;
  nextScan: Date;
  resourceCount: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface FrameworkScore {
  name: string;
  score: number;
  trend: number;
}

interface RiskCategory {
  name: string;
  score: number;
  items: RiskItem[];
}

interface RiskItem {
  title: string;
  description: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'WARNING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface ComplianceTrend {
  framework: string;
  currentScore: number;
  previousScore: number;
  change: number;
}

interface AIRecommendation {
  id: string;
  title: string;
  framework: string;
  severity: string;
  description: string;
  action: string;
}

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.css']
})
export class ComplianceComponent implements OnInit {
  // Data properties
  overallScore = 78;
  frameworkScores: FrameworkScore[] = [];
  riskCategories: RiskCategory[] = [];
  complianceChecks: ComplianceCheck[] = [];
  filteredChecks: ComplianceCheck[] = [];
  complianceTrends: ComplianceTrend[] = [];
  aiRecommendations: AIRecommendation[] = [];

  // Filter properties
  selectedFramework = '';
  selectedProvider = '';

  // Modal properties
  showScheduleModal = false;
  showAIGuidance = false;
  scanFrequency = 'weekly';
  scanTime = '02:00';
  availableFrameworks = ['GDPR', 'SOC 2', 'ISO 27001', 'HIPAA', 'CIS Benchmarks'];
  selectedFrameworks: string[] = [];

  // Math object for template access
  Math = Math;

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadComplianceData();
    this.loadFrameworkScores();
    this.loadRiskCategories();
    this.loadComplianceChecks();
    this.loadComplianceTrends();
    this.loadAIRecommendations();
  }

  loadComplianceData() {
    this.http.get<any>(`${this.apiUrl}/compliance/overview`).subscribe({
      next: (data) => {
        this.overallScore = data.overallScore;
      },
      error: (error) => {
        console.error('Error loading compliance data:', error);
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    // Mock overall score
    this.overallScore = 78;
  }

  loadFrameworkScores() {
    this.frameworkScores = [
      { name: 'GDPR', score: 85, trend: 5 },
      { name: 'SOC 2', score: 92, trend: 2 },
      { name: 'ISO 27001', score: 78, trend: -3 },
      { name: 'HIPAA', score: 65, trend: 8 },
      { name: 'CIS Benchmarks', score: 88, trend: 1 }
    ];
  }

  loadRiskCategories() {
    this.riskCategories = [
      {
        name: 'Access Control',
        score: 85,
        items: [
          {
            title: 'Multi-Factor Authentication',
            description: 'MFA enabled for all users',
            status: 'COMPLIANT',
            severity: 'HIGH'
          },
          {
            title: 'Privileged Access Management',
            description: 'PAM controls in place',
            status: 'WARNING',
            severity: 'MEDIUM'
          },
          {
            title: 'Access Reviews',
            description: 'Regular access reviews conducted',
            status: 'NON_COMPLIANT',
            severity: 'HIGH'
          }
        ]
      },
      {
        name: 'Data Protection',
        score: 72,
        items: [
          {
            title: 'Data Encryption at Rest',
            description: 'All data encrypted at rest',
            status: 'COMPLIANT',
            severity: 'CRITICAL'
          },
          {
            title: 'Data Encryption in Transit',
            description: 'TLS 1.2+ for all communications',
            status: 'COMPLIANT',
            severity: 'CRITICAL'
          },
          {
            title: 'Data Classification',
            description: 'Data classification policy implemented',
            status: 'WARNING',
            severity: 'MEDIUM'
          }
        ]
      },
      {
        name: 'Network Security',
        score: 90,
        items: [
          {
            title: 'Firewall Rules',
            description: 'Proper firewall configuration',
            status: 'COMPLIANT',
            severity: 'HIGH'
          },
          {
            title: 'Network Segmentation',
            description: 'Network properly segmented',
            status: 'COMPLIANT',
            severity: 'HIGH'
          },
          {
            title: 'VPN Configuration',
            description: 'Secure VPN setup',
            status: 'COMPLIANT',
            severity: 'MEDIUM'
          }
        ]
      },
      {
        name: 'Monitoring & Logging',
        score: 68,
        items: [
          {
            title: 'Security Monitoring',
            description: 'SIEM system in place',
            status: 'WARNING',
            severity: 'HIGH'
          },
          {
            title: 'Log Retention',
            description: 'Logs retained for required period',
            status: 'NON_COMPLIANT',
            severity: 'MEDIUM'
          },
          {
            title: 'Incident Response',
            description: 'Incident response plan documented',
            status: 'COMPLIANT',
            severity: 'HIGH'
          }
        ]
      }
    ];
  }

  loadComplianceChecks() {
    this.complianceChecks = [
      {
        id: 'gdpr-001',
        title: 'Data Subject Rights Implementation',
        framework: 'GDPR',
        provider: 'AWS',
        description: 'Verify that data subject rights (access, rectification, erasure) are properly implemented',
        status: 'PASS',
        lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextScan: new Date(Date.now() + 22 * 60 * 60 * 1000),
        resourceCount: 15,
        severity: 'HIGH'
      },
      {
        id: 'soc2-001',
        title: 'Access Control Monitoring',
        framework: 'SOC 2',
        provider: 'Azure',
        description: 'Monitor and log all access to customer data and systems',
        status: 'PASS',
        lastScan: new Date(Date.now() - 1 * 60 * 60 * 1000),
        nextScan: new Date(Date.now() + 23 * 60 * 60 * 1000),
        resourceCount: 8,
        severity: 'CRITICAL'
      },
      {
        id: 'iso-001',
        title: 'Information Security Management',
        framework: 'ISO 27001',
        provider: 'GCP',
        description: 'Verify implementation of information security management system',
        status: 'WARNING',
        lastScan: new Date(Date.now() - 4 * 60 * 60 * 1000),
        nextScan: new Date(Date.now() + 20 * 60 * 60 * 1000),
        resourceCount: 12,
        severity: 'HIGH'
      },
      {
        id: 'hipaa-001',
        title: 'Administrative Safeguards',
        framework: 'HIPAA',
        provider: 'AWS',
        description: 'Ensure administrative safeguards are in place for PHI protection',
        status: 'FAIL',
        lastScan: new Date(Date.now() - 6 * 60 * 60 * 1000),
        nextScan: new Date(Date.now() + 18 * 60 * 60 * 1000),
        resourceCount: 5,
        severity: 'CRITICAL'
      },
      {
        id: 'cis-001',
        title: 'CIS Control 3.2.1',
        framework: 'CIS',
        provider: 'Azure',
        description: 'Ensure S3 buckets have encryption enabled',
        status: 'PASS',
        lastScan: new Date(Date.now() - 1 * 60 * 60 * 1000),
        nextScan: new Date(Date.now() + 23 * 60 * 60 * 1000),
        resourceCount: 20,
        severity: 'MEDIUM'
      },
      {
        id: 'cis-002',
        title: 'CIS Control 4.1.1',
        framework: 'CIS',
        provider: 'GCP',
        description: 'Verify that CloudTrail is enabled and configured properly',
        status: 'PENDING',
        lastScan: new Date(Date.now() - 8 * 60 * 60 * 1000),
        nextScan: new Date(Date.now() + 16 * 60 * 60 * 1000),
        resourceCount: 3,
        severity: 'HIGH'
      }
    ];
    this.filteredChecks = this.complianceChecks;
  }

  loadComplianceTrends() {
    this.complianceTrends = [
      { framework: 'GDPR', currentScore: 85, previousScore: 80, change: 5 },
      { framework: 'SOC 2', currentScore: 92, previousScore: 90, change: 2 },
      { framework: 'ISO 27001', currentScore: 78, previousScore: 81, change: -3 },
      { framework: 'HIPAA', currentScore: 65, previousScore: 57, change: 8 },
      { framework: 'CIS Benchmarks', currentScore: 88, previousScore: 87, change: 1 }
    ];
  }

  loadAIRecommendations() {
    this.aiRecommendations = [
      {
        id: 'ai-001',
        title: 'Enable S3 Bucket Encryption',
        framework: 'CIS-3.2.1',
        severity: 'HIGH',
        description: 'Enable server-side encryption for your S3 buckets to meet CIS benchmark requirements. This will protect your data at rest and improve your compliance posture.',
        action: 'Enable S3 bucket encryption with AES-256'
      },
      {
        id: 'ai-002',
        title: 'Implement Multi-Factor Authentication',
        framework: 'SOC 2-CC6.1',
        severity: 'CRITICAL',
        description: 'Enable MFA for all administrative accounts to strengthen access controls and meet SOC 2 requirements for logical access security.',
        action: 'Enable MFA for all IAM users with administrative privileges'
      },
      {
        id: 'ai-003',
        title: 'Configure CloudTrail Logging',
        framework: 'CIS-4.1.1',
        severity: 'MEDIUM',
        description: 'Enable CloudTrail logging to monitor API calls and maintain an audit trail for compliance and security purposes.',
        action: 'Enable CloudTrail with log file validation'
      }
    ];
  }

  // Filter methods
  filterByFramework() {
    this.applyFilters();
  }

  filterByProvider() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredChecks = this.complianceChecks.filter(check => {
      const frameworkMatch = !this.selectedFramework || check.framework === this.selectedFramework;
      const providerMatch = !this.selectedProvider || check.provider === this.selectedProvider;
      return frameworkMatch && providerMatch;
    });
  }

  // Status and class methods
  getScoreClass(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'warning';
    return 'critical';
  }

  getComplianceStatus(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Needs Attention';
    return 'Critical';
  }

  getRiskLevel(score: number): string {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Medium';
    return 'High';
  }

  getRiskLevelClass(score: number): string {
    if (score >= 80) return 'low-risk';
    if (score >= 60) return 'medium-risk';
    return 'high-risk';
  }

  getCheckStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getCheckIcon(status: string): string {
    switch (status) {
      case 'PASS': return 'icon-check';
      case 'FAIL': return 'icon-error';
      case 'WARNING': return 'icon-warning';
      case 'PENDING': return 'icon-clock';
      default: return 'icon-question';
    }
  }

  getRiskItemClass(status: string): string {
    return status.toLowerCase().replace('_', '-');
  }

  getRiskIcon(status: string): string {
    switch (status) {
      case 'COMPLIANT': return 'icon-check';
      case 'NON_COMPLIANT': return 'icon-error';
      case 'WARNING': return 'icon-warning';
      default: return 'icon-question';
    }
  }

  // Action methods
  runComplianceScan() {
    console.log('Running full compliance scan...');
    // TODO: Implement full compliance scan
  }

  scheduleScan() {
    this.showScheduleModal = true;
  }

  closeScheduleModal() {
    this.showScheduleModal = false;
  }

  saveSchedule() {
    console.log('Saving scan schedule:', {
      frequency: this.scanFrequency,
      time: this.scanTime,
      frameworks: this.selectedFrameworks
    });
    this.closeScheduleModal();
  }

  viewCheckDetails(check: ComplianceCheck) {
    console.log('Viewing check details:', check);
  }

  runSingleCheck(check: ComplianceCheck) {
    console.log('Running single check:', check);
  }

  getAIRecommendation(check: ComplianceCheck) {
    this.showAIGuidance = true;
    console.log('Getting AI recommendation for:', check);
  }

  toggleAIGuidance() {
    this.showAIGuidance = !this.showAIGuidance;
  }

  implementRecommendation(recommendation: AIRecommendation) {
    console.log('Implementing recommendation:', recommendation);
  }

  learnMore(recommendation: AIRecommendation) {
    console.log('Learning more about:', recommendation);
  }
}
