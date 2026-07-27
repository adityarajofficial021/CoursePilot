/* Chart.js Integrations & Analytics Manager */

export const AnalyticsCharts = {
  instances: {},

  /**
   * Initializes or updates all analytical charts on the Dashboard and Grades pages
   */
  init(gradesData, attendanceData) {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js is not loaded yet.');
      return;
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#9CA3AF' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)';
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#4F46E5';
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#06B6D4';

    // Destroy existing chart instances before re-rendering
    Object.keys(this.instances).forEach((key) => {
      if (this.instances[key]) {
        this.instances[key].destroy();
      }
    });

    // 1. Bar Chart - Subject Grades
    const barCtx = document.getElementById('gradesBarChart')?.getContext('2d');
    if (barCtx && gradesData && gradesData.length) {
      const labels = gradesData.map(g => g.courseName.split(' ')[0] + ' ' + (g.courseName.split(' ')[1] || ''));
      const scores = gradesData.map(g => g.overallPct);

      this.instances.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Overall Grade (%)',
            data: scores,
            backgroundColor: primaryColor,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `Grade: ${ctx.raw}%`
              }
            }
          },
          scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            y: { ticks: { color: textColor }, grid: { color: gridColor }, min: 50, max: 100 }
          }
        }
      });
    }

    // 2. Line Chart - GPA Trend
    const lineCtx = document.getElementById('gpaLineChart')?.getContext('2d');
    if (lineCtx) {
      this.instances.line = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6 (Current)'],
          datasets: [{
            label: 'GPA',
            data: [3.65, 3.72, 3.80, 3.84, 3.85, 3.88],
            borderColor: secondaryColor,
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: secondaryColor,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            y: { ticks: { color: textColor }, grid: { color: gridColor }, min: 3.0, max: 4.0 }
          }
        }
      });
    }

    // 3. Doughnut Chart - Grade Distribution
    const doughnutCtx = document.getElementById('gradeDoughnutChart')?.getContext('2d');
    if (doughnutCtx) {
      this.instances.doughnut = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ['A+ (95%+)', 'A (90-94%)', 'B+ (85-89%)'],
          datasets: [{
            data: [3, 1, 1],
            backgroundColor: [primaryColor, secondaryColor, '#F59E0B'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12 } }
          },
          cutout: '70%'
        }
      });
    }

    // 4. Radar Chart - Skill Competencies
    const radarCtx = document.getElementById('skillRadarChart')?.getContext('2d');
    if (radarCtx) {
      this.instances.radar = new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: ['Algorithms', 'SaaS Architecture', 'AI & ML', 'UI/UX Design', 'Database Systems', 'DevOps'],
          datasets: [{
            label: 'Skill Level',
            data: [92, 98, 85, 96, 82, 70],
            borderColor: primaryColor,
            backgroundColor: 'rgba(79, 70, 229, 0.25)',
            pointBackgroundColor: primaryColor
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            r: {
              ticks: { display: false },
              grid: { color: gridColor },
              pointLabels: { color: textColor, font: { size: 11 } }
            }
          }
        }
      });
    }

    // 5. Area Chart - Monthly Attendance Trend
    const areaCtx = document.getElementById('attendanceAreaChart')?.getContext('2d');
    if (areaCtx && attendanceData && attendanceData.monthlyData) {
      this.instances.area = new Chart(areaCtx, {
        type: 'line',
        data: {
          labels: attendanceData.monthlyData.map(m => m.month),
          datasets: [{
            label: 'Attendance %',
            data: attendanceData.monthlyData.map(m => m.pct),
            borderColor: '#22C55E',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            y: { ticks: { color: textColor }, grid: { color: gridColor }, min: 70, max: 100 }
          }
        }
      });
    }
  }
};
