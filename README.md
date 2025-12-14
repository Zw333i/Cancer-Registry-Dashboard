# Cancer Registry Dashboard

A comprehensive survival rate analysis dashboard based on cancer type and stage at diagnosis, utilizing data from The Cancer Genome Atlas (TCGA) program.

## About the Data

### Source
The Cancer Genome Atlas (TCGA) program is a landmark cancer genomics program that molecularly characterized over 20,000 primary cancer and matched normal samples spanning 33 cancer types.

### Dataset Statistics
- **Original TCGA Dataset**: 11,160 patients across 33 different cancer types
- **Filtered Dataset**: 4,670 patients covering 8 cancer types (including both lung cancer subtypes: LUAD and LUSC)
- **Sample Size Used**: 356 patients

### Sample Size Calculation
The sample size of 356 was determined using a statistical sample size calculator with the following parameters:
- Confidence Level: 95%
- Margin of Error: 5%
- Population Proportion: 50%
- Population Size: 4,670

This ensures statistically significant results with a 95% confidence level and 5% margin of error.

### Cancer Types Included
1. BRCA - Breast Invasive Carcinoma
2. LUAD - Lung Adenocarcinoma
3. LUSC - Lung Squamous Cell Carcinoma
4. COAD - Colon Adenocarcinoma
5. PRAD - Prostate Adenocarcinoma
6. STAD - Stomach Adenocarcinoma
7. BLCA - Bladder Urothelial Carcinoma
8. LIHC - Liver Hepatocellular Carcinoma

## Features

### Interactive Dashboard
- Real-time statistics display with animated counters
- Responsive design optimized for desktop, tablet, and mobile devices
- Dark and light theme toggle with persistent preference storage

### Sidebar Navigation
- Interactive human body diagram for organ-based cancer filtering
- Clickable organ regions (brain, lungs, liver, stomach, colon, bladder, prostate, breast)
- Quick filter buttons for each cancer type
- Lung cancer subtype filter (LUAD/LUSC)
- Search functionality for patient lookup

### Statistical Overview Cards
- **Survival Rate**: Overall survival percentage with per-cancer-type breakdown
- **Hope Indicator**: Average survival duration in months across all cancer types
- **Critical Watch**: High-risk cancer and stage combinations requiring attention
- **Total Patients**: Complete patient count with status distribution

### Data Visualizations
- **Cancer Distribution Chart**: Doughnut chart showing patient distribution by cancer type
- **Stage Progression Chart**: Stacked bar chart displaying stage distribution across cancer types
- **Survival Curve**: Kaplan-Meier style survival analysis with stage-based breakdown
- **Age vs Survival Bubble Chart**: Correlation analysis between age at diagnosis and survival duration

### Patient Spotlight
- Individual patient profile display with detailed information
- Patient navigation controls (previous, next, random shuffle)
- Patient tags showing cancer type, stage, and vital status
- Survival duration and prognosis comparison
- AI-generated patient narrative summary

### Data Table
- Comprehensive patient records table
- Sortable columns (Patient ID, Cancer Type, Stage, Status, Survival)
- Horizontal scroll support for mobile devices
- Quick access from sidebar organ clicks

### Comparison Feature
- Side-by-side cancer type comparison
- Statistical comparison including patient count, survival rate, and average survival months
- Visual comparison charts
- Insight generation based on comparison data

### Modals and Interpretations
- Detailed modal views for each statistical card
- Cancer-type-specific breakdowns
- Contextual health tips and interpretations
- Stage-specific survival information

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js library
- **Styling**: Custom CSS with CSS Variables for theming
- **Data Format**: CSV (Comma-Separated Values)
- **Responsive Framework**: Custom media queries for all device sizes

## File Structure

```
health informatics/
├── index.html              # Main HTML file
├── README.md               # Project documentation
├── css/
│   ├── variables.css       # CSS custom properties and theme variables
│   ├── intro.css           # Introduction and loading styles
│   ├── sidebar.css         # Sidebar and body diagram styles
│   ├── header.css          # Header and navigation styles
│   ├── cards.css           # Statistical cards styles
│   ├── charts.css          # Chart container styles
│   ├── spotlight.css       # Patient spotlight styles
│   ├── table.css           # Data table styles
│   ├── comparison.css      # Comparison section styles
│   ├── modals.css          # Modal dialog styles
│   ├── interpretations.css # Interpretation box styles
│   ├── footer.css          # Footer styles
│   └── responsive.css      # Responsive breakpoints
├── js/
│   ├── state.js            # Application state management
│   ├── utils.js            # Utility functions
│   ├── modals.js           # Modal functionality
│   ├── dashboard.js        # Dashboard initialization
│   ├── patient.js          # Patient spotlight logic
│   ├── table.js            # Data table functionality
│   ├── charts.js           # Chart configurations
│   ├── comparison.js       # Comparison feature
│   ├── filters.js          # Filter functionality
│   ├── events.js           # Event listeners
│   └── init.js             # Application initialization
└── data/
    └── data.csv            # Patient dataset
```

## Deployment on GitHub Pages

Follow these steps to deploy the dashboard on GitHub Pages:

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in to your account
2. Click the **+** icon in the top-right corner and select **New repository**
3. Enter a repository name (e.g., `cancer-registry-dashboard`)
4. Set the repository to **Public** (required for free GitHub Pages)
5. Do NOT initialize with a README (you already have one)
6. Click **Create repository**

### Step 2: Initialize Git and Push Your Code

Open a terminal in your project folder and run the following commands:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Cancer Registry Dashboard"

# Add your GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/cancer-registry-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (tab at the top)
3. Scroll down to **Pages** in the left sidebar (under "Code and automation")
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select **main** and **/ (root)**
6. Click **Save**

### Step 4: Access Your Deployed Site

1. Wait 1-2 minutes for GitHub to build and deploy your site
2. Refresh the Settings > Pages section
3. You will see a message: "Your site is live at `https://YOUR_USERNAME.github.io/cancer-registry-dashboard/`"
4. Click the link to view your deployed dashboard

### Troubleshooting

- **404 Error**: Ensure `index.html` is in the root directory of your repository
- **CSS/JS Not Loading**: Check that all file paths in `index.html` are relative (e.g., `css/style.css` not `/css/style.css`)
- **Data Not Loading**: GitHub Pages serves static files; ensure your CSV path is correct
- **Changes Not Appearing**: Clear your browser cache or wait a few minutes for GitHub to rebuild

## Browser Support

- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari
- Mobile browsers (iOS Safari, Chrome for Android)

## License

This project uses publicly available data from The Cancer Genome Atlas (TCGA) program. TCGA data is available without restrictions on its use in publications or presentations.

## Acknowledgments

- The Cancer Genome Atlas (TCGA) program for providing the dataset
- National Cancer Institute (NCI) and National Human Genome Research Institute (NHGRI)
- Chart.js library for data visualization
