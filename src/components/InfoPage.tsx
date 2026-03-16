export default function InfoPage() {
  return (
    <aside className="info-panel">
      <div className="info-content">
        <h2>Terminal System Information</h2>
        
        <section className="info-section">
          <h3>System Hierarchy</h3>
          <p>The terminal system is organized in a hierarchical structure:</p>
          <ul className="hierarchy-list">
            <li>Solar System (root)</li>
            <li className="indent-1">→ Planet</li>
            <li className="indent-2">→ Moon</li>
          </ul>
          <p className="info-text">Navigate through this hierarchy using directory commands, similar to a traditional file system.</p>
        </section>

        <section className="info-section">
          <h3>Available Commands</h3>
          
          <div className="command-doc">
            <h4><code>help</code></h4>
            <p>Displays all available commands with brief descriptions.</p>
            <p className="example">Example: <code>&gt; help</code></p>
          </div>

          <div className="command-doc">
            <h4><code>ls</code></h4>
            <p>Lists all items in the current directory. Shows immediate children of the current node.</p>
            <p className="example">Example: <code>&gt; ls</code></p>
            <p className="example-output">Output: Shows planet names, moon names, etc. depending on current location</p>
          </div>

          <div className="command-doc">
            <h4><code>pwd</code></h4>
            <p>Prints the current working directory. Shows your location in the hierarchy.</p>
            <p className="example">Example: <code>&gt; pwd</code></p>
            <p className="example-output">Output: /Solar System/Earth/Moon</p>
          </div>

          <div className="command-doc">
            <h4><code>cd &lt;name&gt;</code></h4>
            <p>Changes the current directory to a child directory. Navigate into subdirectories.</p>
            <p className="example">Example: <code>&gt; cd Earth</code></p>
            <p className="example-note">Note: Directory names are case-sensitive</p>
          </div>

          <div className="command-doc">
            <h4><code>clear</code></h4>
            <p>Clears the terminal history and presents a fresh terminal.</p>
            <p className="example">Example: <code>&gt; clear</code></p>
          </div>

          <div className="command-doc">
            <h4><code>info</code></h4>
            <p>Displays this information panel with system details and command documentation.</p>
            <p className="example">Example: <code>&gt; info</code></p>
          </div>
        </section>
      </div>
    </aside>
  )
}
