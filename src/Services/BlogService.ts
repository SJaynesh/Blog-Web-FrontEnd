import toast from "react-hot-toast";
import { authService } from "./AuthService"
import axios from "axios";

class BlogService {
    baseURL = "https://blog-web-backend-1-dkyg.onrender.com/api"
    blog = "/blog/"
    userProfile = "/user/profile"

    token = authService.getAuthToken();

    blogHeader() {
        return {
            headers: {
                Authorization: `Braear ${this.token}`
            }
        }
    }

    async fetchAllBlogs() {
        try {
            const res = await axios.get(this.baseURL + this.blog,
                this.blogHeader()
            );

            return res.data;
        } catch (err) {
            console.error("Fetch All Blog: ", err);
            toast.error("Something went wrong !!");
        }
    }

    async fetchSinglBlog(blogId: string) {
        try {
            const res = await axios.get(this.baseURL + this.blog + blogId,
                this.blogHeader()
            );

            return res.data;
        } catch (err) {
            console.error("Fetch Single Blog: ", err);
            toast.error("Something went wrong !!");
        }
    }

    async fetchUserProfile() {
        try {
            const res = await axios.get(this.baseURL + this.userProfile,
                this.blogHeader()
            );

            return res.data;
        } catch (err) {
            console.error("Fetch User Profile : ", err);
            toast.error("Something went wromg..");
        }
    }




}

export const blogService = new BlogService();