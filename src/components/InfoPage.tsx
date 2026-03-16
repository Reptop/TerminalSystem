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
          <p className="info-text">Navigate through this hierarchy using directory commands</p>
        </section>

        <section className="info-section">
          <h3>Available Commands</h3>

          <div className="command-doc">
            <h4><code>help</code></h4>
            <p>Displays all available commands with brief descriptions.</p>
            <p className="example">Example: <code>&gt; help</code></p>
          </div>

          <div className="command-doc">
            <h4><code>fastfetch</code></h4>
            <p>Displays all immediate information about celestial body of the current directory</p>
            <p className="example">Example: <code>&gt; fastfetch</code></p>
            <p className="example-output">Output: 
              <p>host : solar-system-sim</p>
              <p>root : /solar-system</p>
              <p>path : /solar-system</p>
              <p>node : solar-system</p>
              <p>type : system</p>
              <p>renderable : yes</p>
            </p>
          </div>

          <div className="command-doc">
            <h4><code>ls</code></h4>
            <p>Displays immediate children of the current celestial entity. Lists all items in the current directory. </p>
            <p className="example">Example: <code>&gt; ls</code></p>
            <p className="example-output">Output: Shows planet names, moon names, etc. depending on current location</p>
          </div>

          <div className="command-doc">
            <h4><code>pwd</code></h4>
            <p>Displays your location in the solar system. Prints the current working directory.</p>
            <p className="example">Example: <code>&gt; pwd</code></p>
            <p className="example-output">Output: /Solar System/Earth/Moon</p>
          </div>

          <div className="command-doc">
            <h4><code>cd &lt;name&gt;</code></h4>
            <p> Navigate further into or outside the solar system. Changes the current directory to a child or the parent directory.</p>
            <p className="example">Example: <code>&gt; cd earth</code></p>
          </div>

          <div className="command-doc">
            <h4><code>clear</code></h4>
            <p>Clears the terminal history and presents a fresh terminal.</p>
            <p className="example">Example: <code>&gt; clear</code></p>
          </div>

          <div className="command-doc">
            <h4><code>info</code></h4>
            <p>Displays this information panel with system details and command documentation. Congrats you have found this command!</p>
            <p className="example">Example: <code>&gt; info</code></p>
          </div>

          <div className="command-doc">
            <h4><code>render</code></h4>
            <p>Displays a 3d render of the current celestial body of the current directory in a new information panel</p>
            <p className="example">Example: <code>&gt; render</code></p>
          </div>

          <div className="command-doc">
            <h4><code>inspect</code></h4>
            <p>Displays stats and facts of the current celestial body of the current directory in a new information panel</p>
            <p className="example">Example: <code>&gt; innspect</code></p>
          </div>
        </section>
      </div>
    </aside>
  )
}
