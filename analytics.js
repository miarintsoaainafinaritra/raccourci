document.addEventListener('DOMContentLoaded', function() {
    // Enregistrement du plugin Chart.js
    Chart.register(ChartDataLabels);

    // Données de production de noix
    const nutData = {
        2023: {
            production: [1200, 950, 800, 1100, 1300, 1050], // kg
            quality: [85, 78, 82, 88, 90, 83], // % qualité premium
            varieties: {
                labels: ['Noix de Grenoble', 'Noix de Périgord', 'Noix Franquette', 'Autres'],
                data: [45, 30, 20, 5]
            },
            monthlyTrend: [3.80, 3.75, 3.82, 3.88, 3.92, 3.95, 3.98, 3.96, 3.90, 3.85, 3.82, 3.78] // €/kg
        },
        2024: {
            production: [1300, 1100, 900, 1250, 1400, 1150],
            quality: [88, 80, 85, 90, 92, 86],
            varieties: {
                labels: ['Noix de Grenoble', 'Noix de Périgord', 'Noix Franquette', 'Autres'],
                data: [48, 32, 17, 3]
            },
            monthlyTrend: [3.82, 3.78, 3.85, 3.90, 3.95, 3.98, 4.00, 3.98, 3.93, 3.88, 3.85, 3.80]
        }
    };

    // Initialisation du sélecteur d'année
    const yearSelect = document.getElementById('yearSelector');
    const currentYear = new Date().getFullYear();
    const startYear = 2000;
    const endYear = currentYear + 5;

    // Ajout des options d'année
    function initializeYearSelector() {
        const allYearsOption = document.createElement('option');
        allYearsOption.value = 'all';
        allYearsOption.textContent = 'Toutes années';
        yearSelect.appendChild(allYearsOption);

        for (let year = endYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
            
            if (year === currentYear) {
                option.selected = true;
            }
        }
    }

    // Génération de données aléatoires pour les années non définies
    function generateYearData(year) {
        const baseYear = 2024;
        const variation = (year - baseYear) * 0.02;
        
        return {
            production: nutData[baseYear].production.map(val => 
                Math.round(val * (1 + variation * (0.8 + Math.random() * 0.4)))),
            quality: nutData[baseYear].quality.map(val => 
                Math.min(100, Math.round(val * (1 + variation * (0.5 + Math.random() * 0.1))))),
            varieties: {
                labels: nutData[baseYear].varieties.labels,
                data: nutData[baseYear].varieties.data.map(val => 
                    Math.round(val * (1 + variation * (0.2 + Math.random() * 0.1))))
            },
            monthlyTrend: nutData[baseYear].monthlyTrend.map(val => 
                parseFloat((val * (1 + variation * (0.3 + Math.random() * 0.2))).toFixed(2)))
        };
    }

    // Calcul des indicateurs clés
    function calculateKPIs(year) {
        let data;
        
        if (year === 'all') {
            data = {
                production: nutData[2023].production.map((val, i) => val + nutData[2024].production[i]),
                quality: nutData[2023].quality.map((val, i) => (val + nutData[2024].quality[i]) / 2),
                varieties: {
                    data: nutData[2023].varieties.data.map((val, i) => (val + nutData[2024].varieties.data[i]) / 2)
                }
            };
        } else {
            data = nutData[year] || generateYearData(year);
        }
        
        const totalProduction = data.production.reduce((a, b) => a + b, 0);
        const avgQuality = (data.quality.reduce((a, b) => a + b, 0) / data.quality.length);
        const grenoblePercentage = data.varieties.data[0];
        
        return {
            totalProduction: `${totalProduction.toLocaleString('fr-FR')} kg`,
            avgQuality: `${avgQuality.toFixed(0)}%`,
            grenoblePercentage: `${grenoblePercentage}%`
        };
    }

    // Mise à jour des indicateurs
    function updateKPIs(year) {
        const kpis = calculateKPIs(year);
        
        document.querySelectorAll('.kpi-value')[0].textContent = kpis.totalProduction;
        document.querySelectorAll('.kpi-value')[1].textContent = kpis.avgQuality;
        document.querySelectorAll('.kpi-value')[3].textContent = kpis.grenoblePercentage;
    }

    // Configuration des graphiques
    const chartConfigs = {
        production: {
            type: 'bar',
            data: {
                labels: ['Verger A', 'Verger B', 'Verger C', 'Verger D', 'Verger E', 'Verger F'],
                datasets: [{
                    label: 'Production (kg)',
                    backgroundColor: 'rgba(90, 110, 7, 0.8)',
                    borderColor: 'rgba(90, 110, 7, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => `${value}kg`
                    }
                },
                scales: {
                    y: { beginAtZero: true, title: { text: 'Kilogrammes' } }
                }
            }
        },
        quality: {
            type: 'radar',
            data: {
                labels: ['Verger A', 'Verger B', 'Verger C', 'Verger D', 'Verger E', 'Verger F'],
                datasets: [{
                    label: 'Qualité Premium (%)',
                    backgroundColor: 'rgba(143, 161, 45, 0.2)',
                    borderColor: 'rgba(90, 110, 7, 1)'
                }]
            },
            options: {
                scales: {
                    r: { suggestedMin: 70, suggestedMax: 100 }
                }
            }
        },
        variety: {
            type: 'doughnut',
            data: {
                labels: nutData[2024].varieties.labels,
                datasets: [{
                    backgroundColor: [
                        'rgba(90, 110, 7, 0.8)',
                        'rgba(143, 161, 45, 0.8)',
                        'rgba(194, 197, 61, 0.8)',
                        'rgba(226, 227, 171, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return `${(value * 100 / sum).toFixed(1)}%`;
                        }
                    }
                }
            }
        },
        trend: {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Prix moyen (€/kg)',
                    fill: true,
                    backgroundColor: 'rgba(143, 161, 45, 0.1)',
                    borderColor: 'rgba(90, 110, 7, 1)',
                    tension: 0.3
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: false }
                }
            }
        }
    };

    // Initialisation des graphiques
    const charts = {
        production: new Chart(document.getElementById('productionChart'), chartConfigs.production),
        quality: new Chart(document.getElementById('qualityChart'), chartConfigs.quality),
        variety: new Chart(document.getElementById('varietyChart'), chartConfigs.variety),
        trend: new Chart(document.getElementById('monthlyTrendChart'), chartConfigs.trend)
    };

    // Mise à jour des données des graphiques
    function updateCharts(year) {
        const data = year === 'all' ? {
            production: nutData[2023].production.map((val, i) => Math.round((val + nutData[2024].production[i]) / 2)),
            quality: nutData[2023].quality.map((val, i) => Math.round((val + nutData[2024].quality[i]) / 2)),
            varieties: {
                data: nutData[2023].varieties.data.map((val, i) => Math.round((val + nutData[2024].varieties.data[i]) / 2))
            },
            monthlyTrend: nutData[2023].monthlyTrend.map((val, i) => parseFloat(((val + nutData[2024].monthlyTrend[i]) / 2).toFixed(2)))
        } : nutData[year] || generateYearData(year);

        charts.production.data.datasets[0].data = data.production;
        charts.quality.data.datasets[0].data = data.quality;
        charts.variety.data.datasets[0].data = data.varieties.data;
        charts.trend.data.datasets[0].data = data.monthlyTrend;

        Object.values(charts).forEach(chart => chart.update());
    }

    // Export PDF
    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        
        html2canvas(document.querySelector('.dashboard'), {
            scale: 2,
            logging: false
        }).then(canvas => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`production-noix-${new Date().toISOString().slice(0, 10)}.pdf`);
        });
    }

    // Initialisation
    initializeYearSelector();
    updateCharts(currentYear);
    updateKPIs(currentYear);

    // Écouteurs d'événements
    yearSelect.addEventListener('change', function() {
        const year = this.value;
        updateCharts(year);
        updateKPIs(year);
    });

    document.getElementById('exportBtn').addEventListener('click', exportToPDF);
});