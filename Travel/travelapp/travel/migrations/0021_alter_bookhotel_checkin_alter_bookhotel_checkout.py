# Generated by Django 4.2.16 on 2024-10-07 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0020_remove_bookhotel_breakfastornone_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkin",
            field=models.CharField(default="2024-10-08", max_length=40),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkout",
            field=models.CharField(default="2024-10-09", max_length=40),
        ),
    ]
