import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ClickService } from './services/click.service';

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

  semesterCount: number = 0;
  semesters: Semester[] = [];
  cgpa: number | null = null;

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
      const response = await fetch(`http://localhost:3000/api/clicks/subject/${course.code}`);
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
    fetch('http://localhost:3000/api/open-url')
      .then(response => response.json())
      .then(data => {
        console.log('Page Opened:', data);
        this.isPageOpened = true;
      })
      .catch(error => console.error('Error opening page:', error));
  }

  // Initiate data scraping and fetch available semesters
  scrapeData() {
    this.isAutomated = true;
    this.isScrapeDisabled = true;
    fetch('http://localhost:3000/api/scrape-data')
      .then(response => response.json())
      .then(data => {
        console.log('Scraped Data:', data);
        this.availableSemesters = data.availableSemesters;
        this.semesterData = data.semesterData;
        // Close the automated tab
      fetch('http://localhost:3000/api/close-tab')
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
}
