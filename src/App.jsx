import { useState } from 'react'
import './App.css'

function App() {

  // Set state variables
  const [profileText, setProfileText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    // Prevents reload on form submission
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const profileList = profileText.split(',').map(p => p.trim())
    const candidateList = profileList[0].split('')

    try {
      // Calls GCF
      const response = await fetch("https://singlepeaked-396-249233670711.us-central1.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidates: candidateList,
          profile: profileList
        })
      })

      const data = await response.json()
      setResult(data.result || "Error")
    } 
    catch (error) {
      setResult("Failed to contact server.")
    } 
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Single-Peaked Profile Checker</h1>
      <p>Enter a candidate profile.<br/>Write <i>abcdef</i> to indicate a vote where a is ranked first, b is ranked
second, etc. <br/> Comma-separate each ranking, e.g. abcd,bdac,dcab.</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Submit"}
        </button>
      </form>

      {result && (
        <p>
          {Array.isArray(result) ? `Axis: ${result.join(" > ")}` : result}
        </p>
      )}
    </div>
  )
}

export default App
