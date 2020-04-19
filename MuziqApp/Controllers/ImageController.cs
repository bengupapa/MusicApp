﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MuziqApp.Controllers
{
    public class ImageController : Controller
    {
        public ActionResult GetAlbumArt(string imageUrl)
        {
            return File(imageUrl, "image/*");
        }
    }
}