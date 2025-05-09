# Generated by Django 4.2.16 on 2024-10-04 03:40

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0007_alter_bookhotel_checkin_alter_bookhotel_checkout_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkin",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 4, 3, 40, 42, 277682)
            ),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkout",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 4, 3, 40, 42, 277696)
            ),
        ),
        migrations.AlterField(
            model_name="rating_tour",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
