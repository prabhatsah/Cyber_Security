import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const type = (await params).type;
        const formData = await request.formData()

        if (type == 'tag') {
            const tag = formData.get('tag')?.toString() || '';
            revalidateTag(tag);
        } else {
            const path = formData.get('path')?.toString() || '';
            revalidatePath(path);
        }
        return Response.json({ success: true });
    } catch (error) {
        console.error(error);
        return Response.error();
    }

}
