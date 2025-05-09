# Generated by Django 4.2.16 on 2024-10-03 14:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0005_bookhotel_state_bookticket_state_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkin",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 3, 14, 57, 32, 347329)
            ),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkout",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 3, 14, 57, 32, 347345)
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="Avatar",
            field=models.ImageField(
                default=1, max_length=1000, upload_to="TravelImage/%Y/%m/"
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="user",
            name="Cover",
            field=models.ImageField(max_length=1000, upload_to="TravelImage/%Y/%m/"),
        ),
    ]
