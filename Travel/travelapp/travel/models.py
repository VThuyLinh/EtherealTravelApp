from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField
from django.contrib.auth.hashers import make_password
import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class DateGeneral(models.Model):
    DatePost = models.DateTimeField(auto_now_add=True)
    DateUpdate = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class VaiTro(models.TextChoices):
    Customer = "Customer"
    Admin = "Admin"


class StateOfOrder(models.TextChoices):
    WaitforPaid = "Wait for Paid"
    Paid = "Paid"
    Complete = "Complete"
    Reject = "Reject"


class SeatClass(models.TextChoices):
    Economy_class = "Economy_class"
    Business_class = "Business_class"
    First_class = "First_class"


class User(AbstractUser):
    username = models.CharField(max_length=20, null=False, default='OK', unique=True)
    password = models.CharField(max_length=300, null=False)
    sdt = models.CharField(max_length=10, null=False)
    address = models.TextField(max_length=300, null=True)
    vaitro = models.CharField(choices=VaiTro.choices, max_length=30, default="Customer")
    Avatar = models.CharField(max_length=255, null=True, default="image/upload/v1727967936/Screenshot_2024-10-03_220517_y6wixr.png")
    Cover = models.CharField(max_length=255, null=True, default="image/upload/v1727922800/mxdjapi8njqincnduxy1.png")

    def __str__(self):
        return (self.username)

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)

        super().save(*args, **kwargs)

class Admin(User):
    DateAdd = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "Admin"


class Customer(User):
    class Meta:
        verbose_name = "Customer"


class Transport(models.Model):
    Name = models.TextField()
    License = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return "%s %s" % (self.Name, self.License)


class TransportCar(Transport):
    seat = models.IntegerField(null=True)

    def __str__(self):
        return "%s %s" % (self.Name, self.License)


class TransportPLane(Transport):
    TotalSeat = models.IntegerField(null=True)
    EconomySeat = models.IntegerField(null=True)
    BusinessSeat = models.IntegerField(null=True)
    FirstSeat = models.IntegerField(null=True)

    def __str__(self):
        return "%s %s" % (self.Name, self.License)


class Place(models.Model):
    Id_Place = models.CharField(max_length=20, unique=True, null=False)
    Place_Name = models.CharField(max_length=200)

    def __str__(self):
        return self.Place_Name


class Album(models.Model):
    Name = models.CharField(max_length=500)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Name


class Image(models.Model):
    Name = models.CharField(max_length=500)
    Path = CloudinaryField()
    created_date = models.DateTimeField(auto_now_add=True)
    album_id = models.ForeignKey(Album, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.Name


class ScheduleTime(models.Model):
    DepartureTime = models.TimeField()

    def __str__(self):
        return str(self.DepartureTime)


class Tour(DateGeneral):
    Id_Tour = models.CharField(max_length=40, null=False, unique=True)
    Tour_Name = models.CharField(max_length=100, unique=True)
    Description = RichTextField()
    DeparturePlace = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='Place.Tour_set+')
    DepartureDay = models.DateField()
    DepartureTime = models.ForeignKey(ScheduleTime, on_delete=models.CASCADE, related_name='ScheduleTime.Tour_set+')
    Destination = models.ForeignKey(Place, on_delete=models.CASCADE)
    Days = models.IntegerField()
    Nights = models.IntegerField()
    Active = models.BooleanField(default=True)
    vehicle = models.ForeignKey(Transport, on_delete=models.CASCADE)
    Adult_price = models.FloatField(default=0)
    Children_price = models.FloatField(default=0)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    cover = models.CharField(max_length=255, null=True, default="image/upload/v1727922800/mxdjapi8njqincnduxy1.png")

    def __str__(self):
        return self.Tour_Name


class News(DateGeneral):
    Name_News = models.CharField(max_length=255, null=False, unique=True)
    image_thumbnail =models.CharField(max_length=255, null=True, default="image/upload/v1727922800/mxdjapi8njqincnduxy1.png")
    active = models.BooleanField(default=True)
    content = RichTextField()
    admin = models.ForeignKey(Admin, null=False, default=1, on_delete=models.CASCADE)
    date_post=models.DateTimeField()

    def __str__(self):
        return self.Name_News


class CMT(DateGeneral):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.CharField(max_length=255, null=True, default="image/upload/v1727967936/Screenshot_2024-10-03_220517_y6wixr.png")

    class Meta:
        abstract = True


class CMT_News(CMT):
    news = models.ForeignKey(News, on_delete=models.CASCADE)
    content = models.CharField(max_length=255)
    def __str__(self):
        return "%s %s %s" % (self.content, self.user, self.news)


class CMT_Tour(CMT):
    tour = models.ForeignKey(Tour, on_delete=models.PROTECT)
    content = models.CharField(max_length=255)
    def __str__(self):
        return "%s %s %s" % (self.content, self.user, self.tour)


class Rating_Tour(DateGeneral):
    tour = models.ForeignKey(Tour, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    NumberOfStar = models.IntegerField()

    class Meta:
        unique_together = ('tour', 'user')


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    Active = models.BooleanField(default=False)

    class Meta:
        abstract = True
    def __str__(self):
        return "%s" % (self.user)


class Like_Tour(Like):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)

    def __str__(self):
        return "%s %s " % (self.tour, self.user)

    class Meta:
        unique_together = ('tour', 'user')



class Like_News(Like):
    news = models.ForeignKey(News, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('news', 'user')


class BookTour(models.Model):
    id_booktour = models.CharField(max_length=10, null=False, default='')
    id_customer_bt = models.ForeignKey(Customer, on_delete=models.CASCADE, default=0)
    book_date = models.DateTimeField(auto_now=True)
    id_tour_id = models.ForeignKey(Tour, on_delete=models.PROTECT, default=0)
    Quantity_Adult = models.IntegerField(default=1)
    Quantity_Children = models.IntegerField(default=0)
    State = models.CharField(choices=StateOfOrder.choices, max_length=50,default="Wait for Paid")
    Price= models.FloatField(null=False)


# class Paid(DateGeneral):
#     id_booktour= models.ForeignKey(BookTour, on_delete=models.CASCADE)

class Hotel(models.Model):
    nameofhotel = models.CharField(max_length=200)
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='Place.Tour_set+')
    address = models.CharField(max_length=1000, default='')
    descriptions = RichTextField()
    album = models.ForeignKey(Album, on_delete=models.CASCADE, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    image= models.CharField(max_length=255,default='')

    def __str__(self):
        return self.nameofhotel


class Like_Hotel(Like):
    hotel = models.ForeignKey(Hotel, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('hotel', 'user')


class Room(DateGeneral):
    name = models.CharField(max_length=1000)
    description = models.CharField(max_length=7000)

    def __str__(self):
        return self.name




class Tag(DateGeneral):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Blog(DateGeneral):
    name = models.CharField(max_length=1000)
    content = RichTextField()
    image = models.CharField(max_length=255, null=True, default="image/upload/v1727967936/Screenshot_2024-10-03_220517_y6wixr.png")
    active = models.BooleanField(default=True)
    user_post = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False, default=1)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.name



class Like_Blog(Like):
    blog = models.ForeignKey(Blog, on_delete=models.PROTECT)
    Active = models.BooleanField(default=False)

    class Meta:
        unique_together = ('blog', 'user')


class CMT_Blog(CMT):
    blog = models.ForeignKey(Blog, on_delete=models.PROTECT)
    content = models.CharField(max_length=255)



class BookTicket(DateGeneral):
    id_bookticket = models.CharField(max_length=10, null=False, default='OK')
    vehicle = models.ForeignKey(Transport, on_delete=models.CASCADE, null=False)
    DepartureTime = models.ForeignKey(ScheduleTime, on_delete=models.CASCADE, null=False,
                                      related_name='ScheduleTime.Tour_set+')
    EstimatedTime = models.ForeignKey(ScheduleTime, on_delete=models.CASCADE, null=False,
                                      related_name='ScheduleTime.Tour_set+')
    OneOrReturn = models.BooleanField(default=True)
    DeparturePlace = models.ForeignKey(Place, on_delete=models.CASCADE, null=False, related_name='Place.Tour_set+')
    Destination = models.ForeignKey(Place, on_delete=models.CASCADE, null=False, related_name='Place.Tour_set+')
    Quantity_Adult = models.IntegerField(default=1)
    Quantity_Children = models.IntegerField(default=0)
    SeatClass = models.CharField(choices=SeatClass.choices, max_length=30, default="Economy_class")
    user_book = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False, default=1)
    State = models.CharField(choices=StateOfOrder.choices, max_length=50)



class HotelRoom(models.Model):
    id_hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, null=False, default=1)
    id_room = models.ForeignKey(Room, on_delete=models.CASCADE, null=False, default=1)
    BreakfastOrNone = models.BooleanField(default=True)
    Price = models.FloatField()


class BookHotel(DateGeneral):
    id_book_hotel = models.CharField(max_length=10, null=False, default='OK')
    id_hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, null=False)
    id_user_book_hotel = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False,
                                           related_name='Customer.bookhotel_set+')
    GuestOrSomeone = models.BooleanField(default=True)
    Checkin = models.CharField(max_length=40, null=False, default='2024-10-08')
    Checkout =  models.CharField(max_length=40, null=False, default='2024-10-09')
    Room = models.ForeignKey(HotelRoom, on_delete=models.CASCADE, null=False)
    State = models.CharField(choices=StateOfOrder.choices, max_length=50,default="Wait for Paid")
    price= models.FloatField(null=False, default=1)


class Location(models.Model):
    kdo= models.CharField(max_length=20, null=False, default="")
    vdo = models.CharField(max_length=20, null=False, default="")
    locationofuser= models.ForeignKey(Customer, on_delete=models.CASCADE)
    diadiem= models.CharField(max_length=255,null=True)
    DatePost = models.DateTimeField(auto_now_add=True)

