export function convertPercentageToLetter(percentage: number): string {
    if (percentage >= 97) {
      return 'A+';
    } else if (percentage >= 90) {
      return 'A';
    } else if (percentage >= 85) {
      return 'A-';
    } else if (percentage >= 80) {
      return 'B+';
    } else if (percentage >= 75) {
      return 'B';
    } else if (percentage >= 70) {
      return 'B-';
    } else if (percentage >= 65) {
      return 'C+';
    } else if (percentage >= 60) {
      return 'C';
    } else if (percentage >= 55) {
      return 'C-';
    } else if (percentage >= 50) {
      return 'D+';
    } else if (percentage >= 45) {
      return 'D';
    } else if (percentage >= 40) {
      return 'D-';
    } else {
      return 'F';
    }
  }

type GradeColorMap = { [key: string]: string };

const gradeColorMap: GradeColorMap = {
  'A+': '#188c0e', // Green
  'A': '#25b717', // Light green
  'A-': '#1dd30c', // Pale green
  'B+': '#52ad4a', // Yellow
  'B': '#6db52b', // Orange
  'B-': '#638742', // Light orange
  'C+': '#959b2b', // Dark orange
  'C': '#b5bc27', // Red
  'C-': '#e5b61b', // Dark red
  'D+': '#e56c1b', // Maroon
  'D': '#e54e1b', // Dark maroon
  'D-': '#fc0202', // Brown
  'F': '#000000' // Black
};

export function getGradeColor(grade: string): string {
  return gradeColorMap[grade] || '#808080';
}
