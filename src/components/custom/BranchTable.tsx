import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function BranchTable({ hospitalId }: { hospitalId: string }) {
    const navigate= useNavigate();
       const [loading, setLoading] = useState(true);
    // const fetchBranch= async()=>{
    //     try {
    //         const token = localStorage.getItem("token");
    //         if (!token) {
    //             navigate("/");
    //             return;
    //         }
    //          setLoading(true);
    //                     const response: Response = await fetch(
    //                         `${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/getallsuperadminbyhospital/${hospitalId}`,
    //                         {
    //                             headers: {
    //                                 Authorization: `Bearer ${token}`,
    //                             },
    //                         }
    //                     );
    //                     setLoading(false);
    //                     const data: { success: boolean; data?: superAdmin[]; msg?: string } = await response.json();
    //                     if (data.success) {
    //                         setSuperadmins(data.data || []);
    //                     } else {
    //                         localStorage.removeItem("token");
    //                         navigate("/");
    //                     }
    //     } catch (error) {
    //          console.error("Error:", error);
    //     }
    // }
    return (
        <div>BranchTable</div>
    )
}
