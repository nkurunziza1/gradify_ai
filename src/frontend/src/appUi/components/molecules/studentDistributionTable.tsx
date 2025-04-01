import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { TableHeader } from "../atoms/tableHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Combination = {
  combinationName: string;
  school: string;
};

interface Student {
  id: string | number;
  name: string;
  registrationNumber: string;
  score?: number;
  selectedCombinations?: Combination[];
  level: string;
  assignedSchool?: string;
  allocatedCombinations?: Combination[];
  explanation?: string;
  totalMarks: number;
  createdAt?: Date;
}

interface StudentDistributionTableProps {
  students: Student[];
}

export const StudentDistributionTable = ({
  students,
}: StudentDistributionTableProps) => {
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleReasonClick = (explanation: string, studentName: string) => {
    setSelectedExplanation(explanation);
    setSelectedStudent(studentName);
    setDialogOpen(true);
  };

  const headers = [
    "Student Name",
    "Registration",
    "Total Marks",
    "Assigned School",
    "Allocated Combination",
    "Reason",
  ];

  // Calculate pagination
  const totalPages = Math.ceil(students.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStudents = students.slice(startIndex, endIndex);

  // Handle page changes
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader headers={headers} />
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center h-32 text-muted-foreground"
              >
                No students distributed yet.
              </TableCell>
            </TableRow>
          ) : (
            paginatedStudents.map((student, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.registrationNumber}</TableCell>
                <TableCell>{student.totalMarks || "N/A"}</TableCell>
                <TableCell>{student.assignedSchool || "No match"}</TableCell>
                <TableCell>{student.allocatedCombinations || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleReasonClick(
                        student.explanation || "No explanation available",
                        student.name
                      )
                    }
                  >
                    View Reason
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      {students.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="p-1 text-sm border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog for displaying the explanation */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assignment Explanation for {selectedStudent}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-sm">{selectedExplanation}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
