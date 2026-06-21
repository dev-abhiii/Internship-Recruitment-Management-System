import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Internship {
  id: string;
  title: string;
  description: string;
  location: string;
  stipend: number;
  skill_required: string[];
  status: string;
  created_at: string;
}

export default function CandidateDashboard(){
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternship = async() => {
        try{
            const token = localStorage.getItem('token');

            if(!token){
                navigate('/login');
                return;
            }
            
            const response = await fetch(`${API_URL}/internships`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error (data.message || 'Failed to fetch Internships');
            }

            setInternships(data.data);
        }
        catch(err: any){
            setError(err.message);
        }
        setLoading(false);
    };

    fetchInternship();
  },[navigate]);   

  const handleLogout =() =>{
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading internships...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">InternPortal</h1>
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Available Internships</h2>

        {internships.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">No internships posted yet</h3>
            <p className="text-slate-500 mt-2">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loop through the internships and render a card for each one */}
            {internships.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    {job.status}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>
                
                <div className="space-y-2 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">Location:</span> {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">Stipend:</span> ₹{job.stipend}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skill_required.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}