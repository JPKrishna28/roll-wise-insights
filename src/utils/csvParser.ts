
export interface StudentCSVData {
  rollNumber: string;
  fullName: string;
  marks: number;
  backlogs: number;
  attendance: number;
  semester: string;
  branch: string;
}

export const parseCSV = (csvText: string): StudentCSVData[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const students: StudentCSVData[] = [];

  // Expected headers (case insensitive)
  const expectedHeaders = ['rollnumber', 'fullname', 'marks', 'backlogs', 'attendance', 'semester', 'branch'];
  
  // Check if all required headers are present
  const missingHeaders = expectedHeaders.filter(expected => 
    !headers.some(header => header.replace(/\s+/g, '').toLowerCase() === expected)
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
  }

  // Find column indices
  const getColumnIndex = (columnName: string) => {
    return headers.findIndex(header => 
      header.replace(/\s+/g, '').toLowerCase() === columnName.toLowerCase()
    );
  };

  const rollNumberIndex = getColumnIndex('rollnumber');
  const fullNameIndex = getColumnIndex('fullname');
  const marksIndex = getColumnIndex('marks');
  const backlogsIndex = getColumnIndex('backlogs');
  const attendanceIndex = getColumnIndex('attendance');
  const semesterIndex = getColumnIndex('semester');
  const branchIndex = getColumnIndex('branch');

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim());
    
    if (row.length < headers.length) {
      console.warn(`Row ${i + 1} has fewer columns than expected, skipping`);
      continue;
    }

    try {
      const student: StudentCSVData = {
        rollNumber: row[rollNumberIndex] || '',
        fullName: row[fullNameIndex] || '',
        marks: parseInt(row[marksIndex]) || 0,
        backlogs: parseInt(row[backlogsIndex]) || 0,
        attendance: parseInt(row[attendanceIndex]) || 0,
        semester: row[semesterIndex] || '',
        branch: row[branchIndex] || ''
      };

      if (student.rollNumber && student.fullName) {
        students.push(student);
      } else {
        console.warn(`Row ${i + 1} missing required data (Roll Number or Full Name), skipping`);
      }
    } catch (error) {
      console.warn(`Error parsing row ${i + 1}:`, error);
    }
  }

  return students;
};
