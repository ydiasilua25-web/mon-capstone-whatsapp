export async function uploadImage(file) {

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", "kadea_chat");

    const response = await fetch("https://api.cloudinary.com/v1_1/aphejovp/image/upload",
        {
            method: "POST",
            body: formData
        }
    );

    return await response.json();

}