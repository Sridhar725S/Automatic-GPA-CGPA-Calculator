import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ClickService } from './services/click.service';
import { toPng } from 'html-to-image';

interface Course {
  code: string;
  name: string;
  credits: number;
  grade: string;
}

interface Semester {
  gpa: number;
  credits: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class AppComponent implements OnInit {
  title = 'Automatic GPA & CGPA Calculator'; 
  subjectCount: number = 0;
  courses: Course[] = [];
  grades: string[] = ['O', 'A+', 'A', 'B+', 'B', 'C', 'U'];
  gpa: number | null = null;
  studentDetails: any = null;
  semesterCount: number = 0;
  semesters: Semester[] = [];
  cgpa: number | null = null;
  username = '';
  password = '';
  captcha = '';
  captchaUrl = '';
  loggedIn = false;
  isPageOpened: boolean = false;
  isAutomated: boolean = false;
  isScrapeDisabled: boolean = false;
  availableSemesters: number[] = [];
  semesterData: { [key: string]: { subjectCode: string, grade: string }[] } = {};
  selectedSemester: string = '';

  // Click counts
  gpaClicks: number | null = null;
  cgpaClicks: number | null = null;
  agpaClicks: number | null = null;
  // Date and Time
  currentDate: Date = new Date();
  currentTime: string = '';

  constructor(private http: HttpClient, private clickService: ClickService) {}

  ngOnInit() {
    this.getClickCounts();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  // Update Time
  updateTime() {
    const now = new Date();
    this.currentDate = now;
    this.currentTime = now.toLocaleTimeString();
  }
  // Fetch Click Counts from Server
  getClickCounts() {
    this.clickService.getClickCounts().subscribe(
      (data: any) => {
        const gpaClick = data.find((item: any) => item.type === 'GPA');
        const cgpaClick = data.find((item: any) => item.type === 'CGPA');
        const autogpaClick = data.find((item: any) => item.type === 'Auto_GPA');
        this.gpaClicks = gpaClick ? gpaClick.count : 0;
        this.cgpaClicks = cgpaClick ? cgpaClick.count : 0;
        this.agpaClicks = autogpaClick ? autogpaClick.count: 0;
      },
      (err: any) => console.error(err)
    );
  }
  // Track Click and Update Counts
  trackClick(type: 'GPA' | 'CGPA' | 'Auto_GPA') {
    this.clickService.trackClick(type).subscribe(
      () => this.getClickCounts(),
      (err: any) => console.error(err)
    );
}

  // Update course array based on subject count
  // Update course array based on the subject count dynamically
updateCourses() {
  const currentCount = this.courses.length;

  if (this.subjectCount > currentCount) {
    // Add new empty course objects
    for (let i = currentCount; i < this.subjectCount; i++) {
      this.courses.push({ code: '', name: '', credits: 0, grade: '' });
    }
  } else if (this.subjectCount < currentCount) {
    // Remove extra course objects
    this.courses.splice(this.subjectCount);
  }
}

  // Fetch subject details using API
  async fetchSubjectDetails(course: Course) {
    if (!course.code) return;

    try {
      const response = await fetch(`https://automatic-gpa-cgpa-calculator.onrender.com/api/clicks/subject/${course.code}`);
      if (response.ok) {
        const data = await response.json();
        course.name = data.name;
        course.credits = data.credits;
      } else {
        course.name = 'Invalid Code';
        course.credits = 0;
      }
    } catch (error) {
      console.error('Error fetching subject details:', error);
    }
  }

  // Automatically fetch subject details for all courses
  async fetchAllSubjectDetails() {
    const fetchPromises = this.courses.map(course => this.fetchSubjectDetails(course));
    await Promise.all(fetchPromises);
    this.calculateGPA(); // Automatically calculate GPA after fetching
    this.trackClick('Auto_GPA'); 
  }

  // Calculate GPA based on courses and their grades
  calculateGPA() {
    let totalCredits = 0;
    let totalPoints = 0;
    const gradePoints: { [key: string]: number } = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, U: 0 };

    this.courses.forEach(course => {
      totalCredits += course.credits;
      totalPoints += course.credits * gradePoints[course.grade];
    });

    this.gpa = totalCredits ? totalPoints / totalCredits : null;
    console.log('GPA Calculated:', this.gpa);
  }

  // Update semesters array based on the semester count
  // Update semesters array dynamically based on the semester count
updateSemesters() {
  const currentCount = this.semesters.length;

  if (this.semesterCount > currentCount) {
    // Add new empty semester objects
    for (let i = currentCount; i < this.semesterCount; i++) {
      this.semesters.push({ gpa: 0, credits: 0 });
    }
  } else if (this.semesterCount < currentCount) {
    // Remove extra semester objects
    this.semesters.splice(this.semesterCount);
  }
}


  // Automatically open the GPA page
  openPage() {
    fetch('https://automatic-gpa-cgpa-calculator.onrender.com/api/open-url')
      .then(response => response.json())
      .then(data => {
        console.log('Page Opened:', data);
        this.isPageOpened = true;
        this.captchaUrl = 'https://automatic-gpa-cgpa-calculator.onrender.com/captcha/captcha.png';
      })
      .catch(error => console.error('Error opening page:', error));
  }

  async submitLogin() {
    const body = {
      username: this.username,
      password: this.password,
      captcha: this.captcha
    };
  
    try {
      const response: any = await this.http.post('https://automatic-gpa-cgpa-calculator.onrender.com/submit-login', body).toPromise();
      if (response.status === 'success') {
        this.loggedIn = true;
        alert('✅ Login successful!');
      } else {
        // Catch any unexpected failure with valid response
        alert('⚠️ Invalid credentials or CAPTCHA!');
        this.cancelPopup();
        await this.http.get('https://automatic-gpa-cgpa-calculator.onrender.com/api/close-tab').toPromise();
      }
    } catch (error: any) {
      console.error('🔥 Login error:', error);
      
      // Check if it's a timeout or 500 server error
      if (error.status === 500) {
        alert('❌ Invalid credentials or CAPTCHA!');
      } else if (error.name === 'TimeoutError') {
        alert('⏱️ Login timeout! Try again.');
      } else {
        alert('😵 Unexpected error during login!');
      }
  
      this.cancelPopup();
      await this.http.get('https://automatic-gpa-cgpa-calculator.onrender.com/api/close-tab').toPromise();
    }
  }
  // Initiate data scraping and fetch available semesters
  scrapeData() {
    this.isAutomated = true;
    this.isScrapeDisabled = true;
    fetch('https://automatic-gpa-cgpa-calculator.onrender.com/api/scrape-data')
      .then(response => response.json())
      .then(data => {
        console.log('Scraped Data:', data);
        this.availableSemesters = data.availableSemesters;
        this.semesterData = data.semesterData;
        this.parseScrapedData(data);
        // Close the automated tab
      fetch('https://automatic-gpa-cgpa-calculator.onrender.com/api/close-tab')
      .then(() => console.log('Automated tab closed.'))
      .catch(error => console.error('Error closing tab:', error));

    this.isAutomated = false;
      })
      .catch(error => {
        console.error('Error during scraping:', error);
        this.isAutomated = false;
        this.isScrapeDisabled = false;
      });
  }

  parseScrapedData(data: any) {
    console.log('📦 Full scrape response:', data);
  
    // 👇 Check if data exists first
    if (data && data.studentDetails) {
      this.studentDetails = data.studentDetails;
      console.log('✅ Parsed student details:', this.studentDetails);
    } else {
      console.warn('⚠️ studentDetails missing in response object:', data);
    }
  }

  // Automatically fill course data when a semester is selected
handleSemesterSelection() {
  if (this.selectedSemester && this.semesterData[`0${this.selectedSemester}`]) {
    this.fillCourseData(this.semesterData[`0${this.selectedSemester}`]);
  } else {
    alert('Invalid semester selected.');
  }
}

  // Fill course data and fetch subject details automatically
  fillCourseData(subjects: { subjectCode: string, grade: string }[]) {
    this.subjectCount = subjects.length;
    this.updateCourses();

    subjects.forEach((subject, index) => {
      if (this.courses[index]) {
        this.courses[index].code = subject.subjectCode;
        this.courses[index].grade = subject.grade;
      }
    });

    this.fetchAllSubjectDetails(); // Automatically fetch details and calculate GPA
  }

  // Calculate CGPA based on semesters
  calculateCGPA() {
    let totalCredits = 0;
    let weightedGpa = 0;

    this.semesters.forEach(semester => {
      totalCredits += semester.credits;
      weightedGpa += semester.gpa * semester.credits;
    });

    this.cgpa = totalCredits ? weightedGpa / totalCredits : null;
  }
  cancelPopup() {
    const confirmClose = confirm('Are you sure you want to cancel the login?');
    if (confirmClose) {
      this.isPageOpened = false;
      this.captchaUrl = '';
      this.username = '';
      this.password = '';
      this.captcha = '';
    }
    fetch('https://automatic-gpa-cgpa-calculator.onrender.com/api/close-tab')
      .then(() => console.log('Automated tab closed.'))
      .catch(error => console.error('Error closing tab:', error));
  }
  printContainer(container: HTMLElement) {
    const cloned = container.cloneNode(true) as HTMLElement;
  
    // Replace form elements with styled span elements for visual parity
    const inputsAndSelects = cloned.querySelectorAll('input, select');
    inputsAndSelects.forEach(el => {
      const span = document.createElement('span');
      span.textContent = (el as HTMLInputElement).value || (el as HTMLSelectElement).value;
      span.style.display = 'inline-block';
      span.style.padding = '6px 10px';
      span.style.border = '1px solid #ccc';
      span.style.borderRadius = '6px';
      span.style.backgroundColor = '#f0f0f0';
      span.style.margin = '4px 0';
      span.style.minWidth = '100px';
      el.parentNode?.replaceChild(span, el);
    });
  
    const popup = window.open('', '_blank', 'width=900,height=800');
    if (popup) {
      popup.document.open();
      popup.document.write(`
        <html>
          <head>
            <title>📄 AUTOMATIC GPA AND CGPA CALCULATOR</title>
             <style>
  body {
    font-family: "Segoe UI", Roboto, sans-serif;
    padding: 2rem;
    background-color: #fff;
    color: #333;
    font-size: 16px;
  }

  h2, h3 {
    color: #2d89ef;
    margin-bottom: 1rem;
    border-bottom: 2px solid #ddd;
    padding-bottom: 5px;
    text-align: center;
  }

  p, span, div {
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  p {
    color: rgb(55, 134, 224);
    text-align: center;
    font-size: 20px;
    font-weight: Bold;
  }

  .box {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    background-color: #fafafa;
  }
  button, .no-print {
    display: none !important;
  }
</style>

          </head>
          <body onload="window.print(); window.close();">
            <div class="box">
              ${cloned.innerHTML}
            </div>
          </body>
        </html>
      `);
      popup.document.close();
    }
  }
  
  

captureScreenshot(container: HTMLElement) {
  toPng(container, {
    cacheBust: true,
    backgroundColor: 'white',
    pixelRatio: 2,
  }).then((dataUrl: string) => {
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = dataUrl;
    link.click();
  }).catch(err => {
    console.error('Screenshot error:', err);
  });
}

}

}
