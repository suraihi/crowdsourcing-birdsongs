# custom_filters.py

from django import template

register = template.Library()

@register.filter
def convert_to_time_format(duration):

    if duration == None:
        return f"{00:02d}:{00:02d}"
    minutes = int(duration // 60)
    seconds = int(duration % 60)
    return f"{minutes:02d}:{seconds:02d}"
