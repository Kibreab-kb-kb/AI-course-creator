"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const CourseTable = () => {
  const course_data = trpc.get_all_courses.useQuery();

  const router = useRouter();
  const courses = course_data?.data ?? [];
  return (
    <Card className="w-full h-full flex flex-col justify-center">
      <CardContent className="w-full h-full pt-4 px-4">
        <div className="w-full flex mb-4 justify-end">
          <Button
            onClick={() => {
              return router.push("/create-course");
            }}
            className="text-xs h-8 w-24 flex justify-between shadow"
          >
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Course Name</TableHead>
              <TableHead className="text-right">Chapters</TableHead>
              <TableHead className="text-right">Topics</TableHead>
              <TableHead className="text-right">Questions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow className="h-16" key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell className="text-right">
                  {course.chapters.length}
                </TableCell>
                <TableCell className="text-right">
                  {course.chapters.reduce((acc, row) => {
                    acc += row.topics.length;
                    return acc;
                  }, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {course.chapters.reduce((acc, row) => {
                    acc += row.topics.reduce((act, rowt) => {
                      act += rowt?.questions?.length ?? 0;
                      return act;
                    }, 0);
                    return acc;
                  }, 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="w-full text-sm text-muted-foreground flex justify-center">
        Last Generated Courses
      </CardFooter>
    </Card>
  );
};

export default CourseTable;
