---
layout: page
title: Joint Models
description: Assessing the relationship between time to treatment and BCR in PCa patients.
img: assets/img/projects/rsrch_phd_jointmodel/main.png
importance: 1
category: Research
tags:
  - Statistics
  - INLAjoint
  - R
giscus_comments: true
---

This is the third research project from my PhD studies. Most of the methodological work was done during my research visit to KAUST, under the supervision of Denis Rustand, PhD, and Prof. Haavard Rue.

<br>
Published paper: <a href='https://www.sciencedirect.com/science/article/pii/S2352914825001169' target="_blank">DOI: 10.1016/j.imu.2025.101727</a>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/projects/rsrch_phd_jointmodel/kaust_1.jpeg" title="kaust_batouche" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

This work was accepted for presentation at the <a href='https://baltic.uroweb.org/'>Baltic-24 EAU</a> meeting (May 2024, Tallinn, Estonia) and <a href='https://iscb2024.info/'>ISCB-45</a> (July 2024, Thessaloniki, Greece).

<div class="text-center">
<h2 >Joint Modeling to Assess the Relationship Between Time to Curative Treatment and Treatment Recurrence in PCa Patients</h2>
</div>

<h3>Abstract </h3>
<h4>Introduction and Objectives</h4>Conflicting evidence exists regarding the effect of prostate cancer (PCa) treatment delay on outcomes after curative treatment. PCa is
generally slow-growing, and treatment delays up to 6 months have not been associated with impaired outcomes. However, the effect
of treatment delay on outcomes in intermediate PCa is more controversial, especially during the MRI era. In this study, we assessed
the effect of delaying or expedited curative treatment (surgery or radiation therapy) on the time to treatment relapse.

<h4>Materials and Methods:</h4> We used the Helsinki University Hospital registry for data mining and to categorize PCa patients by Gleason grade group (1-5),
treatment (RP/RT), and follow-up outcome (BCR) for a final sample size of 11719 patients (1993–2019). A broader definition of
biochemical recurrence was established considering secondary treatments as an additional indicator of relapse alongside traditional
PSA cut-offs (PSA of 0.2 ug/l for surgery and PSA nadir +2 ug/l for radiation therapy). A joint survival model (using the INLAJoint R
package) was employed to model the relationship between the time from diagnosis to curative treatment (treatment risk) and the
time from diagnosis to treatment recurrence (relapse risk).

<h4>Results:</h4> Conditional on covariates, including age at diagnosis and Gleason grade group, our joint survival model revealed a negative
association γ = -0.99 [-0.99, -0.81] between the risk of treatment and risk of treatment relapse. Regardless of the grade group,
individuals within the top 15% with the lowest risk of receiving treatment (i.e., the longest time to treatment) exhibited a 1.96 [1.05,
7.17] increased risk of recurrence compared to the average individual. Conversely, individuals within the top 15% with the highest
risk of receiving treatment (i.e., the shortest time to treatment) showed a 0.51 [0.14, 0.95] decreased risk of recurrence. When fitting
separate models for each grade group, the association decreased in higher grade groups. Additionally, associations of delaying
treatment were stronger than associations of earlier treatment.

<br>
<p>
If you have any feedback or comments, please feel free to leave them in the section below.

Thank you!

</p>
