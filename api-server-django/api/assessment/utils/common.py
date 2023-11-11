from matplotlib.patheffects import withStroke
import matplotlib.patheffects as path_effects
import numpy as np
import matplotlib
matplotlib.use('agg')
from matplotlib import pyplot as plt
from api.assessment.constants import ROLES, COLOR_MAPPING
import os


recipe = list(COLOR_MAPPING.keys())
colors = [COLOR_MAPPING[recipe_name] for recipe_name in recipe]
data = [1] * len(recipe)

def generate_user_pie_chart(user_top3_label, folder_path):
    

    user_top3_label = [i.lower() for i in user_top3_label]
    

    fig, ax = plt.subplots(figsize=(6, 3), subplot_kw=dict(aspect="equal"))
    explode = [0.05] * len(recipe)

    wedges, texts = ax.pie(data, colors=colors, wedgeprops=dict(width=0.15), startangle=-40, explode=explode)

    bbox_props = dict(boxstyle="square,pad=0.3", fc="w", ec="k", lw=0.72)
    kw = dict(arrowprops=dict(arrowstyle="-"), bbox=bbox_props, zorder=0, va="center")

    annotation_indices = [recipe.index(i.lower()) for i in user_top3_label]

    for i, p in enumerate(wedges):
        if i in annotation_indices:
            ang = (p.theta2 - p.theta1) / 2. + p.theta1
            y = np.sin(np.deg2rad(ang))
            x = np.cos(np.deg2rad(ang))
            horizontalalignment = {-1: "right", 1: "left"}[int(np.sign(x))]
            connectionstyle = f"angle,angleA=0,angleB={ang}"
            kw["arrowprops"].update({"connectionstyle": connectionstyle})
            ax.annotate(recipe[i], xy=(x, y), xytext=(1.75 * np.sign(x), 1.4 * y),
                        horizontalalignment=horizontalalignment, **kw)

    center_text = plt.gca().text(0.0, 0.0, 'Limeneal', color='white', ha='center', va='center', size=10, fontfamily='sans-serif')
    stroke = withStroke(linewidth=3, foreground='black')
    center_text.set_path_effects([stroke, path_effects.Normal()])
    center_circle = plt.Circle((0, 0), 0.35, color='#f5cff7')
    ax.add_artist(center_circle)
    plt.tight_layout()

    plt.savefig(os.path.join(folder_path, "user_top3.png"), dpi=300, transparent=True)
    plt.close(fig)



def generate_jobs_pie_chart(folder_path=None,user_profile=None,count = 1):

    
    
    job_info = []

    for job in user_profile.job_aspirations.all():
        job_info.append({
            'job_name': job.title,
            'career_cluster': job.career_cluster.name if job.career_cluster else None,
            'lwdimension_field1': job.lwdimension_field1.feature if job.lwdimension_field1 else None,
            'lwdimension_field2': job.lwdimension_field2.feature if job.lwdimension_field2 else None,
            'lwdimension_field3': job.lwdimension_field3.feature if job.lwdimension_field3 else None
        })
    
    if count == 0:
        return job_info

    for job_rank in range(count):
        fig, ax = plt.subplots(figsize=(6, 3), subplot_kw=dict(aspect="equal"))

        recipe = list(COLOR_MAPPING.keys())
        data = [1]*len(recipe)

        colors = [COLOR_MAPPING[recipe_name] for recipe_name in recipe]

        # Create an "explode" list to specify which segments to explode
        explode = [0.05, 0.05, 0.05, 0.05, 0.05, 0.05,0.05, 0.05, 0.05]

        wedges, texts = ax.pie(data, colors=colors, wedgeprops=dict(width=0.15), startangle=-40, explode=explode)

        bbox_props = dict(boxstyle="square,pad=0.3", fc="w", ec="k", lw=0.72)
        kw = dict(arrowprops=dict(arrowstyle="-"), bbox=bbox_props, zorder=0, va="center")

        # Add annotations only for "angel" and "principal"

        lw_dimensions = job_info[job_rank]
        dimension_fields = ['lwdimension_field1', 'lwdimension_field2', 'lwdimension_field3']

        annotation_indices = [recipe.index(lw_dimensions[dim].lower()) for dim in dimension_fields]

        

        for i, p in enumerate(wedges):
            if i in annotation_indices:
                ang = (p.theta2 - p.theta1) / 2. + p.theta1
                y = np.sin(np.deg2rad(ang))
                x = np.cos(np.deg2rad(ang))
                horizontalalignment = {-1: "right", 1: "left"}[int(np.sign(x))]
                connectionstyle = f"angle,angleA=0,angleB={ang}"
                kw["arrowprops"].update({"connectionstyle": connectionstyle})
                ax.annotate(recipe[i], xy=(x, y), xytext=(1.75 * np.sign(x), 1.4 * y),
                            horizontalalignment=horizontalalignment, **kw)

        # Add 'A' to the center of the pie chart with path effects
        center_text = plt.gca().text(0.0, 0.0, 'Limeneal', color='white', ha='center', va='center', size=10,fontfamily='sans-serif')
        stroke = withStroke(linewidth=3, foreground='black')
        center_text.set_path_effects([stroke, path_effects.Normal()])

        center_circle = plt.Circle((0, 0), 0.35, color='#f5cff7')
        ax.add_artist(center_circle)
        plt.tight_layout()

        plt.savefig(os.path.join(folder_path, f"job{job_rank+1}dimmensions.png"), dpi=300,transparent=True)
        plt.clf()
        plt.close()

    return job_info
