import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { updateBlogStatus } from "@/utils/api";
import { BlogStatus } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
}

function DraftAction({ id }: Props) {
  const queryClient = useQueryClient();

  const { mutate: update } = useMutation({
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
      onClick={() => {
        update({
          blogId: id,
          values: {
            id,
            status: BlogStatus.DRAFT,
          },
        });
      }}
    >
      Draft
    </DropdownMenuItem>
  );
}

export default DraftAction;
