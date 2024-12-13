import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { updateBlogStatus } from "@/utils/api";
import { BlogStatus } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
}

function ArchiveAction({ id }: Props) {
  const queryClient = useQueryClient();

  const { mutate: Archive } = useMutation({
    mutationFn: updateBlogStatus,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["blog-list"],
        });
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <DropdownMenuItem
      onClick={() =>
        Archive({
          blogId: id,
          values: {
            id,
            status: BlogStatus.ARCHIVED,
          },
        })
      }
    >
      Archive
    </DropdownMenuItem>
  );
}

export default ArchiveAction;
