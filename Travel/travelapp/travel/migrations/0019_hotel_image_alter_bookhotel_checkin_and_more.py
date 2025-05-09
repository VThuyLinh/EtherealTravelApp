# Generated by Django 4.2.16 on 2024-10-07 06:52

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0018_remove_blog_tag_tag_blog_alter_bookhotel_checkin_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="hotel",
            name="image",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkin",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 7, 6, 52, 14, 368984)
            ),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkout",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 7, 6, 52, 14, 368996)
            ),
        ),
    ]
