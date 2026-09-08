---
layout: page
title: Junction 2019
description: Easy 3D Collab, a cloud-based real-time radiation therapy plan review system developed for Varian.
img: assets/img/projects/hck_junction_19/junc_19_cover.jpg
importance: 3
category: Hackathons
giscus_comments: true
---

This hackathon was my second experience in the <a href='https://www.hackjunction.com/'>Junction</a> hackathon series, and my third hackathon overall.
That year, my team and I decided to participate in the healthcare-related challenge proposed by <a href='https://www.varian.com/'>Varian</a>.

The challenge is still well described at the <a href='https://www.varian.com/node/10985'>following link</a>, but a short summary is included below.

<div class="row">
    <div class="col-sm mt-4 mt-md-0">
        {% include figure.html path="assets/img/projects/hck_junction_19/junction2019.jpg" title="junction2019" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-2 mt-md-0">
        {% include figure.html path="assets/img/projects/hck_junction_19/Siemens-Healthineers-Varian.jpg" title="varian" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<h3>Background</h3>
<p>
The challenge focused on helping doctors work more efficiently. Every day, doctors make countless decisions about the type of treatment each patient should receive. The aim of this challenge was to help them make those decisions more easily, quickly, and reliably.

Every radiotherapy treatment is planned individually for each patient. Often, a physicist creates the plan with the help of a 3D image of the patient. Two essential things can be seen in the image: the area that needs to be treated and the critical organs that should be protected from radiation. Before the patient can be treated, the plan must be approved by a doctor.

</p>

<h3>Challenge</h3>
<p>
Varian's task for the Junction 2019 hackathon was to improve cooperation between doctors and physicists. It is often difficult for a doctor to access the workstation needed to approve a plan while also managing the many other considerations involved in treatment. The workstation may be located in another part of the hospital, or even in a different town from the doctor.

The aim was to use technology to improve the treatment chain so that doctors could work more efficiently when planning treatment. This would give them more time to treat more patients.

</p>

<h3>Our Solution</h3>
<p>We reduced the time required for the plan review process by introducing asynchronous collaboration between the oncologist and the planner(s). Our proposed solution aimed to make each interaction as efficient as possible by integrating 3D collaboration tools with Varian APIs.</p>
<p>In radiation therapy, the plan review process can take a long time before a specific plan is approved. One of the most time-consuming parts of this process is the need for face-to-face interactions between the oncologist (O) and the planners (P). To tackle this problem, we proposed a complete asynchronous collaboration platform designed to minimize the number of interactions between O and P. This could significantly reduce the time needed for plan review by:
<ol>
<li>Eliminating the need for O and P to meet physically, saving time for the oncologist, who is one of the most critical resources.</li>
<li>Providing them with a comprehensive, efficient 3D collaboration platform for fast communication.</li>
</ol>
We integrated our 3D collaboration platform with Varian APIs. In future work, we envisioned extending this idea to remote surgery, since our 3D collaboration feature requires very little overhead, making it a strong candidate for remote surgery applications where fast internet connections are not available. We used Angular and ThreeJS for the frontend, and Google Firestore, Python, Docker, and Azure Storage for the backend.</p>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/projects/hck_junction_19/s1.png" title="Sceenshot 1" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/projects/hck_junction_19/s2.png" title="Sceenshot 2" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/projects/hck_junction_19/s3.png" title="Sceenshot 3" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    These are some screenshots from the developed prototype.
</div>

During the hackathon, we worked on the prototype and recorded the following demo video.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.html path="assets/video/projects/hck_junction_19/3dcollab_webservice.mp4" class="img-fluid rounded z-depth-1" controls=true  width="100%" height="288px"%}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include video.html path="assets/video/projects/hck_junction_19/2DeviceseDemo.mp4" class="img-fluid rounded z-depth-1" controls=true  width="100%"  height="288px"%}
    </div>
</div>
<div class="caption">
    A simple video demonstration of our prototype. On the left is the web app for real-time collaboration on 3D radiology plans. On the right is the real-time display and annotation interface for the 3D plans.
</div>

The PowerPoint slides are below. Click on the videos once you reach the correct slide.

<div class="row mt-3">
    <div class="col-sm mt-12 mt-md-0 center">
        <iframe class="presentation-embed" src="https://onedrive.live.com/embed?resid=3C42663A50F1A304%212806&amp;authkey=!ABfRzclUvGdMMd4&amp;em=2&amp;wdAr=1.7777777777777777&amp;wdEaaCheck=1" title="Project presentation" loading="lazy" allowfullscreen></iframe>
        <p><a href="https://onedrive.live.com/embed?resid=3C42663A50F1A304%212806&amp;authkey=!ABfRzclUvGdMMd4&amp;em=2&amp;wdAr=1.7777777777777777&amp;wdEaaCheck=1" target="_blank" rel="noopener noreferrer">Open presentation in a new tab</a>.</p>
    </div>
</div>

<br>
<p>
If you have any feedback or comments, please feel free to leave them in the section below.

Thank you!

</p>
