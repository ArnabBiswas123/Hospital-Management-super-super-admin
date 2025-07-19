import { useNavigate } from "react-router-dom";

export default function BranchTable({hospitalid}: {hospitalid?: string}) {
    const navigate= useNavigate();
    const fetchBranch= async()=>{
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
        } catch (error) {
             console.error("Error:", error);
        }
    }
    return (
        <div>BranchTable</div>
    )
}
