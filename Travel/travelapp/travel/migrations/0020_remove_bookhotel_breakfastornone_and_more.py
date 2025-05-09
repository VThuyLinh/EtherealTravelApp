# Generated by Django 4.2.16 on 2024-10-07 09:26

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0019_hotel_image_alter_bookhotel_checkin_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="bookhotel",
            name="BreakfastOrNone",
        ),
        migrations.AddField(
            model_name="hotelroom",
            name="BreakfastOrNone",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkin",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 7, 9, 26, 42, 404756)
            ),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkout",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 7, 9, 26, 42, 404778)
            ),
        ),
    ]
