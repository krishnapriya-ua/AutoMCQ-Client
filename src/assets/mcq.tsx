import axios from 'axios';
import { useEffect, useState } from 'react';

const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL; 

function MCQDisplay({ sessionId }: { sessionId: string }) {
  const [mcqData, setMcqData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchMCQ = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/mcq`, {
          params: { sessionId }
        });
        setMcqData(response.data.data); 
        setError(null);
      } catch (err) {
        setError('Failed to fetch MCQs');
        setMcqData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMCQ();
  }, [sessionId]);

  if (loading) return <p></p>;
  if (error) return <p>{error}</p>;
  if (mcqData.length === 0) return <p></p>;

  return (
    <div>
      {mcqData.map((item, index) => (
        <div key={item._id || index} style={{ marginBottom: '20px' }}>
          <h3>{item.videoName}</h3>
          <p>{item.generatedText.slice(0, 500)}{item.generatedText.length > 200 ? '... ' : ''}</p>
         
        </div>
      ))}
    </div>
  );
}

export default MCQDisplay;
