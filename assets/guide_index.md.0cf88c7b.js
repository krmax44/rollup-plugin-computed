import{o as n,c as s,b as a}from"./app.7cbc1c56.js";const t='{"title":"What is this plugin?","description":"","frontmatter":{"title":"What is this plugin?"},"relativePath":"guide/index.md","lastUpdated":1619627185151}',p={},e=a('<h1 id="what-is-this-plugin"><a class="header-anchor" href="#what-is-this-plugin" aria-hidden="true">#</a> What is this plugin?</h1><p>Oftentimes it&#39;s handy to compute some data at build time, like querying an API endpoint, so that it&#39;s faster for the client. This plugin makes it really simple.</p><p>From pulling data out of an API, to grabbing local data from disk, to generating dynamic SVGs: the use-cases are quite wide.</p><p>With this plugin, you can easily write a function to fetch some data, that will be executed by Rollup during build...</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">dateAtBuild</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">const</span> d <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toLocaleDateString</span><span class="token punctuation">(</span><span class="token string">&#39;en-us&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">this bundle was built on </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>and import it in your app:</p><div class="language-js"><pre><code><span class="token comment">// my-app.js</span>\n<span class="token keyword">import</span> dateAtBuild <span class="token keyword">from</span> <span class="token string">&#39;dateAtBuild.computed&#39;</span><span class="token punctuation">;</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;in case you are curious:&#39;</span><span class="token punctuation">,</span> dateAtBuild<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// --&gt; in case you are curious: this bundle was built on ...</span>\n</code></pre></div>',7);p.render=function(a,t,p,o,i,c){return n(),s("div",null,[e])};export default p;export{t as __pageData};