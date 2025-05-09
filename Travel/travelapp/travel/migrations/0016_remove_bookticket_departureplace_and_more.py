# Generated by Django 4.2.16 on 2024-10-07 03:28

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0015_alter_bookhotel_checkin_alter_bookhotel_checkout_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="bookticket",
            name="DeparturePlace",
        ),
        migrations.RemoveField(
            model_name="bookticket",
            name="DepartureTime",
        ),
        migrations.RemoveField(
            model_name="bookticket",
            name="Destination",
        ),
        migrations.RemoveField(
            model_name="bookticket",
            name="EstimatedTime",
        ),
        migrations.RemoveField(
            model_name="bookticket",
            name="State",
        ),
        migrations.RemoveField(
            model_name="bookticket",
            name="vehicle",
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkin",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 7, 3, 28, 29, 492233)
            ),
        ),
        migrations.AlterField(
            model_name="bookhotel",
            name="Checkout",
            field=models.DateTimeField(
                default=datetime.datetime(2024, 10, 7, 3, 28, 29, 492246)
            ),
        ),
        migrations.AlterField(
            model_name="bookticket",
            name="id_bookticket",
            field=models.CharField(default="OK", max_length=10, unique=True),
        ),
        migrations.CreateModel(
            name="TicketPlane",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("OneOrReturn", models.BooleanField(default=True)),
                (
                    "vehicle",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="travel.transportplane",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TicketCar",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "vehicle",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="travel.transportcar",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Ticket",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("Price_Adult", models.FloatField()),
                ("Price_Children", models.FloatField()),
                (
                    "DeparturePlace",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="Place.Ticket_set+",
                        to="travel.place",
                    ),
                ),
                (
                    "DepartureTime",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ScheduleTime.ticket_set+",
                        to="travel.scheduletime",
                    ),
                ),
                (
                    "Destination",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="Place.Ticket_set+",
                        to="travel.place",
                    ),
                ),
                (
                    "EstimatedTime",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ScheduleTime.ticket_set+",
                        to="travel.scheduletime",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="bookticket",
            name="ticket",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to="travel.ticket",
            ),
        ),
    ]
