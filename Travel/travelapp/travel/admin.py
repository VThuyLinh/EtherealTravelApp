from django.contrib import admin
from django.db.models import Count
from django.utils.safestring import mark_safe

from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path
from django.template.response import TemplateResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
import cloudinary


class CustomerAdmin(admin.ModelAdmin):
    list_display = ['username', 'last_name', 'vaitro', 'is_active', 'is_staff']


class MyAdminSite(admin.AdminSite):
    site_header = 'Travel'

    def get_urls(self):
        return [path('travel/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        Tag_stats = Tag.objects.annotate(c=Count('blog')).values('id', 'name', 'c')
        return TemplateResponse(request, 'admin/stats.html', {
            "Tag_stats": Tag_stats
        })

    def stats_view2(self, request):
        statss = Tour.objects.annotate(counter=Count('id')).values('id', 'Tour_Name', 'counter')
        return TemplateResponse(request, 'admin/stats.html', {
            'stats': statss
        })


admin_site = MyAdminSite(name='Travel')


class TourForm(forms.ModelForm):
    Description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Tour
        fields = '__all__'


class HotelRoomAdmin(admin.ModelAdmin):
    list_display = ['id_hotel', 'id_room', 'Price']
    search_fields = ['Price']

    def hotel(self, hotel):
        if hotel.Hotel.Name:
            print(hotel.Hotel.Name)
            return 'hotel.Hotel.Name'


class HotelForm(forms.ModelForm):
    descriptions = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Hotel
        fields = '__all__'


class HotelAdmin(admin.ModelAdmin):
    list_display = ['nameofhotel']
    search_fields = ['nameofhotel']
    form = HotelForm

    def my_image(self, hotel):
        if hotel.album.Path:
            print(hotel.album.Path)
            return mark_safe(f"<img src='/static/ckeditor/{hotel.album.Path}' width='200' />")


class TourAdmin(admin.ModelAdmin):
    list_display = ['Tour_Name']
    search_fields = ['Tour_Name']
    form = TourForm

    def my_image(self, tour):
        if tour.image:
            return mark_safe(f"<img src='/static/{tour.image.Path}' width='200' />")


class BlogForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Blog
        fields = '__all__'

class BlogAdmin(admin.ModelAdmin):
    list_display = ['name']
    form = BlogForm

    class Meta:
        model= Blog
        fields='__all__'

class ScheduleTimeAdmin(admin.ModelAdmin):
    list_display = ['DepartureTime']

    class Meta:
        model = ScheduleTime
        fields = '__all__'


class TourAdmin(admin.ModelAdmin):
    list_display = ['Tour_Name']
    search_fields = ['Tour_Name']
    form = TourForm

    def my_image(self, tour):
        if tour.image:
            return mark_safe(f"<img src='/static/ckeditor/{tour.image.Path}' width='200' />")


class NewsForm(forms.ModelForm):
    Content = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = News
        fields = '__all__'


class NewsAdmin(admin.ModelAdmin):
    list_display = ['Name_News']
    search_fields = ['Name_News']
    # list_filter = ['DatePost']
    readonly_fields = ['my_image']
    form = NewsForm

    def my_image(self, news):
        if news.image:
            return mark_safe(f"<img src='/static/{news.image.name}' width='200' />")


class ImageAdmin(admin.ModelAdmin):
    list_display = ['Name', 'my_image', 'album_id']
    readonly_fields = ['my_image']

    def my_image(self, imageTour):
        if imageTour:
            print(imageTour.Path)
            return mark_safe(f"<img src='https://res.cloudinary.com/dqcjhhtlm/{imageTour.Path}' width='200' />")


class TransportPlaneAdmin(admin.ModelAdmin):
    list_display = ['Name', 'License', 'EconomySeat', 'BusinessSeat', 'FirstSeat']
    search_fields = ['License']

    class Meta:
        model = TransportPLane
        fields = '__all__'


class BookTourAdmin(admin.ModelAdmin):
    list_display = ['id_booktour', 'id_tour_id','State','id_customer_bt']
    search_fields = ['id_booktour']

    class Meta:
        model = BookTour
        fields = '__all__'

class TransportCarAdmin(admin.ModelAdmin):
    list_display = ['Name', 'License', 'seat']
    search_fields = ['License', 'seat']

    class Meta:
        model = TransportCar
        fields = '__all__'


class BookTicketAdmin(admin.ModelAdmin):
    list_display = ['id_bookticket','Quantity_Adult','Quantity_Children','user_book']
    search_fields = ['id_bookticket']

    class Meta:
        model = BookTicket
        fields = '__all__'


class Like_TourAdmin(admin.ModelAdmin):
    list_display = ['tour','user','Active']
    search_fields = ['tour']

    class Meta:
        model = Like_Tour
        fields = '__all__'

class Like_NewsAdmin(admin.ModelAdmin):
    list_display = ['news','user','Active']
    search_fields = ['news']

    class Meta:
        model = Like_News
        fields = '__all__'

class Like_BlogAdmin(admin.ModelAdmin):
    list_display = ['blog','user','Active']
    search_fields = ['blog']

    class Meta:
        model = Like_Blog
        fields = '__all__'

class Like_HotelAdmin(admin.ModelAdmin):
    list_display = ['hotel','user','Active']
    search_fields = ['hotel']

    class Meta:
        model = Like_Hotel
        fields = '__all__'

class CMT_TourAdmin(admin.ModelAdmin):
    list_display = ['content','user','tour']
    search_fields = ['tour']

    class Meta:
        model = CMT_Tour
        fields = '__all__'

class CMT_NewsAdmin(admin.ModelAdmin):
    list_display = ['content','user','news']
    search_fields = ['news']

    class Meta:
        model = CMT_News
        fields = '__all__'

class CMT_BlogAdmin(admin.ModelAdmin):
    list_display = ['content','user','blog']
    search_fields = ['blog']

    class Meta:
        model = CMT_Blog
        fields = '__all__'

class Rating_TourAdmin(admin.ModelAdmin):
    list_display = ['user','tour','NumberOfStar']
    search_fields = ['tour']

    class Meta:
        model = Rating_Tour
        fields = '__all__'


# Register your models here.
admin_site.register(News, NewsAdmin)
admin_site.register(Tour, TourAdmin)
admin_site.register(BookTour,BookTourAdmin)
admin_site.register(Admin)
admin_site.register(CMT_News,CMT_NewsAdmin)
admin_site.register(Like_Tour,Like_TourAdmin)
admin_site.register(Like_News,Like_NewsAdmin)
admin_site.register(Like_Blog,Like_BlogAdmin)
admin_site.register(Like_Hotel,Like_HotelAdmin)
admin_site.register(CMT_Tour,CMT_TourAdmin)
admin_site.register(CMT_Blog,CMT_BlogAdmin)
admin_site.register(Rating_Tour,Rating_TourAdmin)
admin_site.register(Image, ImageAdmin)
admin_site.register(Album)
admin_site.register(Customer, CustomerAdmin)
admin_site.register(BookTicket, BookTicketAdmin)
admin_site.register(TransportCar, TransportCarAdmin)
admin_site.register(TransportPLane, TransportPlaneAdmin)
admin_site.register(ScheduleTime,ScheduleTimeAdmin)
admin_site.register(Tag)
admin_site.register(Place)
admin_site.register(Blog, BlogAdmin)
admin_site.register(BookHotel)
admin_site.register(Room)
admin_site.register(HotelRoom, HotelRoomAdmin)
admin_site.register(Hotel, HotelAdmin)
