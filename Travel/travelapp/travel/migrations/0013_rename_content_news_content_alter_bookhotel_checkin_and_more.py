# Generated by Django 4.2.16 on 2024-10-04 17:40

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0012_alter_bookhotel_checkin_alter_bookhotel_checkout_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="news",
            old_name="Content",
            new_name="content",
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkin",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 4, 17, 40, 11, 894512)
            ),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkout",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 4, 17, 40, 11, 894527)
            ),
        ),
    ]
