import { TableCell, TableRow } from "@/components/ui/table";

const LoaderBody = ({ columnsLength }: { columnsLength: number }) => {
  return (
    <>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <TableRow key={`row-${index}`}>
            {Array(columnsLength)
              .fill(0)
              .map((_, columnIndex) => (
                <TableCell key={`row-column-${columnIndex}`} className=" px-4 text-left">
                  <div className="loader"></div>
                </TableCell>
              ))}
          </TableRow>
        ))}
    </>
  );
};

export default LoaderBody;
