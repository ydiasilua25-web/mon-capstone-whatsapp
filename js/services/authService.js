export async function register(user) {
    try {
        const response = await fetch("https://kadea-chat-api.onrender.com/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677"
            },
            body: JSON.stringify({
                fullName: user.fullName,
                email: user.email,
                password: user.password
            })
        });

        const data = await response.json();
        

       if (!response.ok) {
        return data;
        }

        return data;

    } catch (error) {
        throw error;
    }
}

export async function login(user) {
     try {
        const response = await fetch("https://kadea-chat-api.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677"
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
        const data = await response.json();
        
        /*if (!response.ok) {
            return data;
        }*/

            return data;

    } catch (error) {
        throw error;
    }

}