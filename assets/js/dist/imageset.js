/*!
 * ImageSet (1.0.0-beta1)
 *
 * This script file is needed for lazyloading imagesets,
 * generated with ImageSet for Kirby and rendering placeholder
 * effeccts
 *
 * Copyright (c) 2016 Fabian Michael <hallo@fabianmichael.de>
 * @license SEE LICENSE IN license.md
 *
 * This script also includes:
 *
 *   StackBlur 0.6
 *   Copyright (c) 2010 Mario Klingemann <mario@quasimondo.com>
 *   https://github.com/Quasimondo/QuasimondoJS
 *
 *   lazysizes 2.0.7 (with "static-gecko-picture" plugin)
 *   Copyright (C) 2015 Alexander Farkas, released under MIT license
 *   https://github.com/aFarkas/lazysizes
 * 
 */

;(function(window, document, undefined){
	'use strict';

	var mul_table = [
	        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
	        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
	        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
	        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
	        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
	        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
	        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
	        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
	        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
	        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
	        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
	        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
	        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
	        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
	        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
	        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
	        //'light' => 512, (7) / 15
	        // 'strong' => 512, / 17
	        
	   
	var shg_table = [
		     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
			17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
			19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
			20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
			21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
			21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
			22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
			22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
			23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

	// function stackBlurImage( imageIDOrElement, canvasIDOrElement, radius, blurAlphaChannel )
	// {
				
	// 	var img = stackBlurGetElement( imageIDOrElement );
	// 	var w = img.naturalWidth;
	// 	var h = img.naturalHeight;
	       
	// 	var canvas = stackBlurGetElement( canvasIDOrElement );
	      
	//     canvas.style.width  = w + "px";
	//     canvas.style.height = h + "px";
	//     canvas.width = w;
	//     canvas.height = h;
	    
	//     var context = canvas.getContext("2d");
	//     context.clearRect( 0, 0, w, h );
	//     context.drawImage( img, 0, 0 );

	// 	if ( isNaN(radius) || radius < 1 ) return;
		
	// 	if ( blurAlphaChannel )
	// 		stackBlurCanvasRGBA( canvasIDOrElement, 0, 0, w, h, radius );
	// 	else 
	// 		stackBlurCanvasRGB( canvasIDOrElement, 0, 0, w, h, radius );
	// }


	function stackBlurCanvasRGBA( canvas, top_x, top_y, width, height, radius, mul_sum, shg_sum )
	{
		//var canvas    = stackBlurGetElement( canvasIDOrElement );
		var context   = canvas.getContext("2d");
		var imageData = context.getImageData( top_x, top_y, width, height );
		
		// try {
		//   try {
		// 	imageData = context.getImageData( top_x, top_y, width, height );
		//   } catch(e) {
		  
		// 	// NOTE: this part is supposedly only needed if you want to work with local files
		// 	// so it might be okay to remove the whole try/catch block and just use
		// 	// imageData = context.getImageData( top_x, top_y, width, height );
		// 	try {
		// 		netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		// 		imageData = context.getImageData( top_x, top_y, width, height );
		// 	} catch(e) {
		// 		alert("Cannot access local image");
		// 		throw new Error("unable to access local image data: " + e);
		// 		return;
		// 	}
		//   }
		// } catch(e) {
		//   alert("Cannot access image");
		//   throw new Error("unable to access image data: " + e);
		// }
	  
		imageData = stackBlurImageDataRGBA( imageData, radius, mul_sum, shg_sum );
		context.putImageData( imageData, top_x, top_y );
	}


	function stackBlurImageDataRGBA( imageData, radius, mul_sum, shg_sum )
	{
		// if ( isNaN(radius) || radius < 1 ) return;
		// radius |= 0;
				
		var pixels = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
				
		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
		r_out_sum, g_out_sum, b_out_sum, a_out_sum,
		r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
		pr, pg, pb, pa, rbs;
				
		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = radius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stackEnd;
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		// var mul_sum = mul_table[radius];
		// var shg_sum = shg_table[radius];
		
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			}
			
			
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
				pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
				pixels[yi+3] = (a_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				a_in_sum += ( stackIn.a = pixels[p+3]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i <= radius; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
			   
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
				if ( pa > 0 )
				{
					pa = 255 / pa;
					pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
					pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
					pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
				} else {
					pixels[p] = pixels[p+1] = pixels[p+2] = 0;
				}
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
			   
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
			   
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
		
		return imageData;
		
	}


	function stackBlurCanvasRGB( canvas, top_x, top_y, width, height, radius, mul_sum, shg_sum )
	{
		// if ( isNaN(radius) || radius < 1 ) return;
		// radius |= 0;
		
		//var canvas    = stackBlurGetElement( canvasIDOrElement );
		var context   = canvas.getContext("2d");
		var imageData = context.getImageData( top_x, top_y, width, height );
		
		// try {
		//   try {
		// 	imageData = context.getImageData( top_x, top_y, width, height );
		//   } catch(e) {
		  
		// 	// NOTE: this part is supposedly only needed if you want to work with local files
		// 	// so it might be okay to remove the whole try/catch block and just use
		// 	// imageData = context.getImageData( top_x, top_y, width, height );
		// 	try {
		// 		netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		// 		imageData = context.getImageData( top_x, top_y, width, height );
		// 	} catch(e) {
		// 		alert("Cannot access local image");
		// 		throw new Error("unable to access local image data: " + e);
		// 		return;
		// 	}
		//   }
		// } catch(e) {
		//   alert("Cannot access image");
		//   throw new Error("unable to access image data: " + e);
		// }
				
		var pixels = imageData.data;
				
		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
		r_out_sum, g_out_sum, b_out_sum,
		r_in_sum, g_in_sum, b_in_sum,
		pr, pg, pb, rbs;
				
		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = radius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stackEnd;
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		// var mul_sum = mul_table[radius];
		// var shg_sum = shg_table[radius];
		
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			}
			
			
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
				pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i <= radius; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p]   = (r_sum * mul_sum) >> shg_sum;
				pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
		
		context.putImageData( imageData, top_x, top_y );
		
	}

	function BlurStack()
	{
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.next = null;
	}

	// function stackBlurGetElement( elementOrID )
	// {
	// 	if ( elementOrID.nodeType == 1 )
	// 		return elementOrID;

	// 	return document.getElementById( elementOrID );
	// }


	window.stackBlur = {
		canvasRGB:  stackBlurCanvasRGB,
		canvasRGBA: stackBlurCanvasRGBA,
	};

})(window, document);

;(function(window, document) {
  'use strict';

  var _getElementsByClassName = 'getElementsByClassName';

  if(!document[_getElementsByClassName]){ return; }  

  /* =====  Configuration  ================================================== */

  var prefix = 'imageset';

  var __wrapperClass                    = prefix,
      __wrapperLazyloadClass            = prefix + '--lazyload',
      __wrapperLoadedClass              = prefix + '--loaded',
      __wrapperPlaceholderClass         = prefix + '--placeholder',
      __wrapperPlaceholderStyleClass    = prefix + '--placeholder--',
      __wrapperAlphaClass               = prefix + '--alpha',
      __wrapperPlaceholderRenderedClass = prefix + '--placeholder--rendered',
      __imageElementClass               = prefix + '__element',
      __placeholderElementClass         = prefix + '__placeholder',
      __imagesetHasJSClass              = prefix + '-js';

      // __blurredPlaceholderRadius     = 15,
      // __lqipPlaceholderRadius        = 7;

  /* =====  Variable Shortcuts  ============================================= */

  var docElement               = document.documentElement;

  var ua                       = navigator.userAgent;

  var requestAnimationFrame    = window.requestAnimationFrame || setTimeout;

  var Date                     = window.Date;

  var _addEventListener        = 'addEventListener',
      _getAttribute            = 'getAttribute',
      _removeAttribute         = 'removeAttribute',
      _MutationObserver        = 'MutationObserver',
      _classList               = 'classList',
      _className               = 'className',
      _hasAttribute            = 'hasAttribute',

      _dataSrc                 = 'data-src',
      _dataSrcset              = 'data-srcset'; 

  /* =====  Utilities & Helper Functions  =================================== */
  
  /* -----  Feature Tests  -------------------------------------------------- */

  var isOperaMini                 = (Object.prototype.toString.call(window.operamini) === "[object OperaMini]");
      
  var isSafari                    = (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1);

  var supportsMutationObserver    = !!window[_MutationObserver];

  var supportsCanvas              = !!window.CanvasRenderingContext2D;

  var supportsPixelatedImages     = ('imageRendering' in docElement.style || 'msInterpolationMode' in docElement.style);

  // Shim layer with setTimeout fallback. Look only for unprefixed
  // requestAnimationFrame, because all modern browsern already removed the
  // prefix.
  var rAF = window.requestAnimationFrame || function(callback) { setTimeout(callback, 1000/60); };

  // var supportsObjectFit,
  //     supportsObjectPosition;

  // (function() {
  //   var test = function(props, style) {
  //     for(var i = 0, l = props.length; i < l; i++) {
  //       var prop = props[i];
  //       if(prop in style) return true;
  //     }
  //     return false;
  //   };

  //   var style = window.getComputedStyle(document.createElement('img'), null);
    
  //   supportsObjectFit      = test(['-o-object-fit', 'object-fit'], style);
  //   supportsObjectPosition = supportsObjectFit ? test(['-o-object-position', 'object-position'], style) : false; 
  // })();

  /* -----  Utilities  ------------------------------------------------------ */

  var ready = function(fn) {
    if(document.readyState != 'loading') {
      fn();
    } else {
      document[_addEventListener]('DOMContentLoaded', fn);
    }
  };

  // Extend an object with another one
  var extend = function(base, obj) {
    for(var i in obj) {
      if(obj.hasOwnProperty(i)) {
        base[i] = obj[i];
      }
    }
    return base;
  };

  var imageLoaded = function(img, fn) {
    if(!img.complete || (typeof img.naturalWidth === "undefined") || img.naturalWidth === 0) {
      img[_addEventListener]("load", fn);
    } else {
      fn();
    }
  };

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  var AnimationQueue = (function() {

    var queue       = [],
        _inProgress = false;

    function add(callback) {
      queue.push(callback);
      run();
    }

    function loop() {
      var callback = queue.shift();
      callback();

      if(!queue.length) {
        _inProgress = false;
      } else {
        rAF(loop);
      }
    }

    function run() {
      if(_inProgress) return;
      _inProgress = true;
      rAF(loop);
    }

    return {
      add: add,
    };
  })();

  // Class utilities using `classList` API if available.
  // Fallbacks inspired by: https://gist.github.com/devongovett/1381839
  var hasClass = (function() {
    return document.documentElement[_classList] ?
      function(el, cls) { return el[_classList].contains(cls); } :
      function(el, cls) { return !!~el[_className].split(/\s+/).indexOf(cls); };
  })();

  var addClass = (function() {
    return document.documentElement[_classList] ?
      function(el, cls) { el[_classList].add(cls); } :
      function(el, cls) {
        var classes = el[_className].split(/\s+/);
        if(!~classes.indexOf(cls)) {
          classes.push(cls);
          el[_className] = classes.join(" ");
        }
      };
  })();

  var removeClass = (function() {
    return document.documentElement[_classList] ?
      function(el, cls) { return el[_classList].remove(cls); } :
      function(el, cls) {
        var tokens = el[_className].split(/\s+/),
            index  = tokens.indexOf(cls);
        if(!!~index) {
          tokens.splice(index, 1);
          el[_className] = tokens.join(" ");
        }
      };
  })();


  /* =====  ImageSets & Placeholders  ======================================= */

  var placeholderRenderStack = [];

  function render() {

  }

  /* ----- Special Initialization for Opera Mini  --------------------------- */

  // Make sure to add JS class to document element, if
  // it has not been done by any other script.
  addClass(document.documentElement, __imagesetHasJSClass);

  if(isOperaMini) {
    // Opera Mini has limited DOM Event support and does not
    // work with lazysizes. So we shortcut the loading process
    // of lazy-loading and disable lazysizes.
    window.lazySizesConfig      = window.lazySizesConfig || {};
    window.lazySizesConfig.init = false;

    var loadImageSet = function(el) {
        
      var sources = el.getElementsByTagName("source"),
          img     = el[_getElementsByClassName](__imageElementClass)[0];
    
      // Wrapper should be loaded to trigger css hook like
      // on other browsers.
      addClass(el, __wrapperLoadedClass);

      if(window.HTMLPictureElement) {
        // As of December 2016, Opera Mini does not support
        // the picture element. However, we consider this
        // here for possible implementations in the future.
        for(var i = 0, l = sources.length; i < l; i++) {
          var s = sources[i];
          if(s[_hasAttribute](_dataSrcset)) {
            s.srcset = s[_getAttribute](_dataSrcset);
            s[_removeAttribute](_dataSrcset);
          }
          if(s[_hasAttribute](_dataSrc)) {
            s.src = s[_getAttribute](_dataSrc);
            s[_removeAttribute](_dataSrc);
          }
        }

        if(img[_hasAttribute](_dataSrcset)) {
          img.srcset = img[_getAttribute](_dataSrcset);
          img[_removeAttribute](_dataSrcset);
        }
        if(img[_hasAttribute](_dataSrc)) {
          img.src = img[_getAttribute](_dataSrc);
          img[_removeAttribute](_dataSrc);
        }

      } else {
        
        var fallbackSource = sources.length > 0 ? sources[sources.length - 1] : img,
            candidates     = fallbackSource[_getAttribute](_dataSrcset).split(/,\s+/);

        for(var n = sources.length; n--;) {
          // Delete sources elements 
          sources[n].parentNode.removeChild(sources[n]);
        }

        img.src = candidates.pop().replace(/\s+\d+[wx]$/, '');
      }
    };

    ready(function() {
      var imagesets = document[_getElementsByClassName](__wrapperClass);
      for(var i = 0, l = imagesets.length; i < l; i++) {
        loadImageSet(imagesets[i]);
      }
    });


    return; // Abort Initialization here
  }

  /* ===== Regular Initialization  ========================================== */

  /* ----- Global Variables Setup  ------------------------------------------ */
 
  /* ·····  ImageSet-specific Helper functions  ······························*/

  var placeholderRegexp = new RegExp(__wrapperPlaceholderStyleClass + '([a-z0-9_-]+)\\s*', 'i');

  function getPlaceholderStyle(wrapper) {
    var result = wrapper[_className].match(placeholderRegexp);
    return result ? result[1] : false;
  }

  var placeholderRenderer = {};


  if(!supportsPixelatedImages || isSafari) {

    var pixelRatio = (function() {
      // To account for zoom, change to use deviceXDPI instead of systemXDPI
      if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined &&
          window.screen.systemXDPI > window.screen.logicalXDPI) {
        // Only allow for values > 1
        return window.screen.systemXDPI / window.screen.logicalXDPI;
      } else if (window.devicePixelRatio !== undefined) {
        return window.devicePixelRatio;
      }
      return 1;
    })();

    placeholderRenderer.mosaic = function(el) {

      var canvas      = document.createElement("canvas"),
          ctx         = canvas.getContext("2d"),
          source      = el[_getElementsByClassName](__placeholderElementClass)[0];

      var process = function() {
        var width        = source.naturalWidth,
            height       = source.naturalHeight,
            scaledWidth  = Math.round(el.offsetWidth * pixelRatio),
            scaledHeight = Math.round(el.offsetWidth / width * height * pixelRatio);

        canvas.width  = scaledWidth;
        canvas.height = scaledHeight;

        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        
        canvas.setAttribute("aria-hidden", true);
        canvas[_className] = source[_className];
        
        AnimationQueue.add(function(){
          ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
          source.parentNode.replaceChild(canvas, source);
        });
      };

      imageLoaded(source, process);
    };
  }

  if(supportsCanvas) {

    var applyPlaceholderBlur = function(el, radius, mul_sum, shg_sum) {

      var source = el[_getElementsByClassName](__placeholderElementClass)[0];

      var process = function() {
        var width        = source.naturalWidth,
            height       = source.naturalHeight,
            scaledWidth  = el.offsetWidth,
            scaledHeight = Math.round(el.offsetWidth / width * height),
            
            canvas       = document.createElement("canvas"),
            ctx          = canvas.getContext("2d"),
            alpha        = hasClass(el, __wrapperAlphaClass);

        canvas.width  = scaledWidth;
        canvas.height = scaledHeight;
        
        canvas.setAttribute("aria-hidden", true);
        canvas[_className] = source[_className];
        
        AnimationQueue.add(function(){
          ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
          stackBlur[alpha ? 'canvasRGBA' : 'canvasRGB'](canvas, 0, 0, scaledWidth, scaledHeight, radius, mul_sum, shg_sum);
          source.parentNode.replaceChild(canvas, source);
        });
      };

      imageLoaded(source, function() { process(); });
    };

    placeholderRenderer.blurred = function(el) { applyPlaceholderBlur(el, 15, 512, 17); };
    placeholderRenderer.lqip    = function(el) { applyPlaceholderBlur(el,  7, 512, 15); };
  }


  var imageset = (function() {
    
    var imagesetElements;
    
    function checkImagesets() {
      var style, wrapper;

      for(var i = 0, l = imagesetElements.length; i < l; i++) {
        if(!imagesetElements[i]) continue;

        wrapper = imagesetElements[i];

        if(hasClass(wrapper, __wrapperPlaceholderRenderedClass)) continue;

        style = getPlaceholderStyle(wrapper);
        
        if(style && placeholderRenderer[style]) {
          addClass(wrapper, __wrapperPlaceholderRenderedClass);
          placeholderRenderer[style](wrapper);
        }
      }
    }

    var debouncedCheckImagesets = debounce(checkImagesets);

    function init() {

      document[_addEventListener]('lazybeforeunveil', function (e) {

        var element = e.target,
            wrapper = element.parentNode;

        if(!hasClass(element, __imageElementClass)) return;

        while(!hasClass(wrapper, __wrapperClass)) {
          // Get imageset container element by traversing up the DOM tree
          wrapper = wrapper.parentNode;
        }

        // Define a callback function which gets invoked, after an image has
        // finally loaded.
        var cb = function () {
          element.removeEventListener("load", cb);
          rAF(function () {
            // Asynchronously add loaded class
            addClass(wrapper, __wrapperLoadedClass);
          });
        };

        element[_addEventListener]("load", cb);
      });

      imagesetElements = document[_getElementsByClassName](__wrapperPlaceholderClass);

      if(supportsMutationObserver){
        new window[_MutationObserver]( debouncedCheckImagesets ).observe( docElement, {childList: true, subtree: true, attributes: false, characterData: false } );
      } else {
        docElement[_addEventListener]('DOMNodeInserted', debouncedCheckImagesets, true);
        docElement[_addEventListener]('DOMAttrModified', debouncedCheckImagesets, true);
        setInterval(debouncedCheckImagesets, 999);
      }

      window[_addEventListener]('hashchange', debouncedCheckImagesets, true);

      debouncedCheckImagesets();
    }


    return {
      init: init,
    };

  })();

  ready(imageset.init);

})(window, document);

(function(window, factory) {
	var lazySizes = factory(window, window.document);
	window.lazySizes = lazySizes;
	if(typeof module == 'object' && module.exports){
		module.exports = lazySizes;
	}
}(window, function l(window, document) {
	'use strict';
	/*jshint eqnull:true */
	if(!document.getElementsByClassName){return;}

	var lazySizesConfig;

	var docElem = document.documentElement;

	var Date = window.Date;

	var supportPicture = window.HTMLPictureElement;

	var _addEventListener = 'addEventListener';

	var _getAttribute = 'getAttribute';

	var addEventListener = window[_addEventListener];

	var setTimeout = window.setTimeout;

	var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

	var requestIdleCallback = window.requestIdleCallback;

	var regPicture = /^picture$/i;

	var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

	var regClassCache = {};

	var forEach = Array.prototype.forEach;

	var hasClass = function(ele, cls) {
		if(!regClassCache[cls]){
			regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		}
		return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
	};

	var addClass = function(ele, cls) {
		if (!hasClass(ele, cls)){
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
		}
	};

	var removeClass = function(ele, cls) {
		var reg;
		if ((reg = hasClass(ele,cls))) {
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
		}
	};

	var addRemoveLoadEvents = function(dom, fn, add){
		var action = add ? _addEventListener : 'removeEventListener';
		if(add){
			addRemoveLoadEvents(dom, fn);
		}
		loadEvents.forEach(function(evt){
			dom[action](evt, fn);
		});
	};

	var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
		var event = document.createEvent('CustomEvent');

		event.initCustomEvent(name, !noBubbles, !noCancelable, detail || {});

		elem.dispatchEvent(event);
		return event;
	};

	var updatePolyfill = function (el, full){
		var polyfill;
		if( !supportPicture && ( polyfill = (window.picturefill || lazySizesConfig.pf) ) ){
			polyfill({reevaluate: true, elements: [el]});
		} else if(full && full.src){
			el.src = full.src;
		}
	};

	var getCSS = function (elem, style){
		return (getComputedStyle(elem, null) || {})[style];
	};

	var getWidth = function(elem, parent, width){
		width = width || elem.offsetWidth;

		while(width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth){
			width =  parent.offsetWidth;
			parent = parent.parentNode;
		}

		return width;
	};

	var rAF = (function(){
		var running, waiting;
		var fns = [];

		var run = function(){
			var fn;
			running = true;
			waiting = false;
			while(fns.length){
				fn = fns.shift();
				fn[0].apply(fn[1], fn[2]);
			}
			running = false;
		};

		var rafBatch = function(fn){
			if(running){
				fn.apply(this, arguments);
			} else {
				fns.push([fn, this, arguments]);

				if(!waiting){
					waiting = true;
					(document.hidden ? setTimeout : requestAnimationFrame)(run);
				}
			}
		};

		rafBatch._lsFlush = run;

		return rafBatch;
	})();

	var rAFIt = function(fn, simple){
		return simple ?
			function() {
				rAF(fn);
			} :
			function(){
				var that = this;
				var args = arguments;
				rAF(function(){
					fn.apply(that, args);
				});
			}
		;
	};

	var throttle = function(fn){
		var running;
		var lastTime = 0;
		var gDelay = 125;
		var RIC_DEFAULT_TIMEOUT = 666;
		var rICTimeout = RIC_DEFAULT_TIMEOUT;
		var run = function(){
			running = false;
			lastTime = Date.now();
			fn();
		};
		var idleCallback = requestIdleCallback ?
			function(){
				requestIdleCallback(run, {timeout: rICTimeout});
				if(rICTimeout !== RIC_DEFAULT_TIMEOUT){
					rICTimeout = RIC_DEFAULT_TIMEOUT;
				}
			}:
			rAFIt(function(){
				setTimeout(run);
			}, true)
		;

		return function(isPriority){
			var delay;
			if((isPriority = isPriority === true)){
				rICTimeout = 44;
			}

			if(running){
				return;
			}

			running =  true;

			delay = gDelay - (Date.now() - lastTime);

			if(delay < 0){
				delay = 0;
			}

			if(isPriority || (delay < 9 && requestIdleCallback)){
				idleCallback();
			} else {
				setTimeout(idleCallback, delay);
			}
		};
	};

	//based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
	var debounce = function(func) {
		var timeout, timestamp;
		var wait = 99;
		var run = function(){
			timeout = null;
			func();
		};
		var later = function() {
			var last = Date.now() - timestamp;

			if (last < wait) {
				setTimeout(later, wait - last);
			} else {
				(requestIdleCallback || run)(run);
			}
		};

		return function() {
			timestamp = Date.now();

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};


	var loader = (function(){
		var lazyloadElems, preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

		var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

		var defaultExpand, preloadExpand, hFac;

		var regImg = /^img$/i;
		var regIframe = /^iframe$/i;

		var supportScroll = ('onscroll' in window) && !(/glebot/.test(navigator.userAgent));

		var shrinkExpand = 0;
		var currentExpand = 0;

		var isLoading = 0;
		var lowRuns = -1;

		var resetPreloading = function(e){
			isLoading--;
			if(e && e.target){
				addRemoveLoadEvents(e.target, resetPreloading);
			}

			if(!e || isLoading < 0 || !e.target){
				isLoading = 0;
			}
		};

		var isNestedVisible = function(elem, elemExpand){
			var outerRect;
			var parent = elem;
			var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';

			eLtop -= elemExpand;
			eLbottom += elemExpand;
			eLleft -= elemExpand;
			eLright += elemExpand;

			while(visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem){
				visible = ((getCSS(parent, 'opacity') || 1) > 0);

				if(visible && getCSS(parent, 'overflow') != 'visible'){
					outerRect = parent.getBoundingClientRect();
					visible = eLright > outerRect.left &&
						eLleft < outerRect.right &&
						eLbottom > outerRect.top - 1 &&
						eLtop < outerRect.bottom + 1
					;
				}
			}

			return visible;
		};

		var checkElements = function() {
			var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;

			if((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){

				i = 0;

				lowRuns++;

				if(preloadExpand == null){
					if(!('expand' in lazySizesConfig)){
						lazySizesConfig.expand = docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370;
					}

					defaultExpand = lazySizesConfig.expand;
					preloadExpand = defaultExpand * lazySizesConfig.expFactor;
				}

				if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden){
					currentExpand = preloadExpand;
					lowRuns = 0;
				} else if(loadMode > 1 && lowRuns > 1 && isLoading < 6){
					currentExpand = defaultExpand;
				} else {
					currentExpand = shrinkExpand;
				}

				for(; i < eLlen; i++){

					if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}

					if(!supportScroll){unveilElement(lazyloadElems[i]);continue;}

					if(!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)){
						elemExpand = currentExpand;
					}

					if(beforeExpandVal !== elemExpand){
						eLvW = innerWidth + (elemExpand * hFac);
						elvH = innerHeight + elemExpand;
						elemNegativeExpand = elemExpand * -1;
						beforeExpandVal = elemExpand;
					}

					rect = lazyloadElems[i].getBoundingClientRect();

					if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
						(eLtop = rect.top) <= elvH &&
						(eLright = rect.right) >= elemNegativeExpand * hFac &&
						(eLleft = rect.left) <= eLvW &&
						(eLbottom || eLright || eLleft || eLtop) &&
						((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
						unveilElement(lazyloadElems[i]);
						loadedSomething = true;
						if(isLoading > 9){break;}
					} else if(!loadedSomething && isCompleted && !autoLoadElem &&
						isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
						(preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
						(preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto')))){
						autoLoadElem = preloadElems[0] || lazyloadElems[i];
					}
				}

				if(autoLoadElem && !loadedSomething){
					unveilElement(autoLoadElem);
				}
			}
		};

		var throttledCheckElements = throttle(checkElements);

		var switchLoadingClass = function(e){
			addClass(e.target, lazySizesConfig.loadedClass);
			removeClass(e.target, lazySizesConfig.loadingClass);
			addRemoveLoadEvents(e.target, rafSwitchLoadingClass);
		};
		var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
		var rafSwitchLoadingClass = function(e){
			rafedSwitchLoadingClass({target: e.target});
		};

		var changeIframeSrc = function(elem, src){
			try {
				elem.contentWindow.location.replace(src);
			} catch(e){
				elem.src = src;
			}
		};

		var handleSources = function(source){
			var customMedia, parent;

			var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

			if( (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) ){
				source.setAttribute('media', customMedia);
			}

			if(sourceSrcset){
				source.setAttribute('srcset', sourceSrcset);
			}

			//https://bugzilla.mozilla.org/show_bug.cgi?id=1170572
			if(customMedia){
				parent = source.parentNode;
				parent.insertBefore(source.cloneNode(), source);
				parent.removeChild(source);
			}
		};

		var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg){
			var src, srcset, parent, isPicture, event, firesLoad;

			if(!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented){

				if(sizes){
					if(isAuto){
						addClass(elem, lazySizesConfig.autosizesClass);
					} else {
						elem.setAttribute('sizes', sizes);
					}
				}

				srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
				src = elem[_getAttribute](lazySizesConfig.srcAttr);

				if(isImg) {
					parent = elem.parentNode;
					isPicture = parent && regPicture.test(parent.nodeName || '');
				}

				firesLoad = detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

				event = {target: elem};

				if(firesLoad){
					addRemoveLoadEvents(elem, resetPreloading, true);
					clearTimeout(resetPreloadingTimer);
					resetPreloadingTimer = setTimeout(resetPreloading, 2500);

					addClass(elem, lazySizesConfig.loadingClass);
					addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
				}

				if(isPicture){
					forEach.call(parent.getElementsByTagName('source'), handleSources);
				}

				if(srcset){
					elem.setAttribute('srcset', srcset);
				} else if(src && !isPicture){
					if(regIframe.test(elem.nodeName)){
						changeIframeSrc(elem, src);
					} else {
						elem.src = src;
					}
				}

				if(srcset || isPicture){
					updatePolyfill(elem, {src: src});
				}
			}

			rAF(function(){
				if(elem._lazyRace){
					delete elem._lazyRace;
				}
				removeClass(elem, lazySizesConfig.lazyClass);

				if( !firesLoad || elem.complete ){
					if(firesLoad){
						resetPreloading(event);
					} else {
						isLoading--;
					}
					switchLoadingClass(event);
				}
			});
		});

		var unveilElement = function (elem){
			var detail;

			var isImg = regImg.test(elem.nodeName);

			//allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
			var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
			var isAuto = sizes == 'auto';

			if( (isAuto || !isCompleted) && isImg && (elem.src || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass)){return;}

			detail = triggerEvent(elem, 'lazyunveilread').detail;

			if(isAuto){
				 autoSizer.updateElem(elem, true, elem.offsetWidth);
			}

			elem._lazyRace = true;
			isLoading++;

			lazyUnveil(elem, detail, isAuto, sizes, isImg);
		};

		var onload = function(){
			if(isCompleted){return;}
			if(Date.now() - started < 999){
				setTimeout(onload, 999);
				return;
			}
			var afterScroll = debounce(function(){
				lazySizesConfig.loadMode = 3;
				throttledCheckElements();
			});

			isCompleted = true;

			lazySizesConfig.loadMode = 3;

			throttledCheckElements();

			addEventListener('scroll', function(){
				if(lazySizesConfig.loadMode == 3){
					lazySizesConfig.loadMode = 2;
				}
				afterScroll();
			}, true);
		};

		return {
			_: function(){
				started = Date.now();

				lazyloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass);
				preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
				hFac = lazySizesConfig.hFac;

				addEventListener('scroll', throttledCheckElements, true);

				addEventListener('resize', throttledCheckElements, true);

				if(window.MutationObserver){
					new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
				} else {
					docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
					docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
					setInterval(throttledCheckElements, 999);
				}

				addEventListener('hashchange', throttledCheckElements, true);

				//, 'fullscreenchange'
				['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function(name){
					document[_addEventListener](name, throttledCheckElements, true);
				});

				if((/d$|^c/.test(document.readyState))){
					onload();
				} else {
					addEventListener('load', onload);
					document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
					setTimeout(onload, 20000);
				}

				if(lazyloadElems.length){
					checkElements();
				} else {
					throttledCheckElements();
				}
			},
			checkElems: throttledCheckElements,
			unveil: unveilElement
		};
	})();


	var autoSizer = (function(){
		var autosizesElems;

		var sizeElement = rAFIt(function(elem, parent, event, width){
			var sources, i, len;
			elem._lazysizesWidth = width;
			width += 'px';

			elem.setAttribute('sizes', width);

			if(regPicture.test(parent.nodeName || '')){
				sources = parent.getElementsByTagName('source');
				for(i = 0, len = sources.length; i < len; i++){
					sources[i].setAttribute('sizes', width);
				}
			}

			if(!event.detail.dataAttr){
				updatePolyfill(elem, event.detail);
			}
		});
		var getSizeElement = function (elem, dataAttr, width){
			var event;
			var parent = elem.parentNode;

			if(parent){
				width = getWidth(elem, parent, width);
				event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

				if(!event.defaultPrevented){
					width = event.detail.width;

					if(width && width !== elem._lazysizesWidth){
						sizeElement(elem, parent, event, width);
					}
				}
			}
		};

		var updateElementsSizes = function(){
			var i;
			var len = autosizesElems.length;
			if(len){
				i = 0;

				for(; i < len; i++){
					getSizeElement(autosizesElems[i]);
				}
			}
		};

		var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

		return {
			_: function(){
				autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
				addEventListener('resize', debouncedUpdateElementsSizes);
			},
			checkElems: debouncedUpdateElementsSizes,
			updateElem: getSizeElement
		};
	})();

	var init = function(){
		if(!init.i){
			init.i = true;
			autoSizer._();
			loader._();
		}
	};

	(function(){
		var prop;

		var lazySizesDefaults = {
			lazyClass: 'lazyload',
			loadedClass: 'lazyloaded',
			loadingClass: 'lazyloading',
			preloadClass: 'lazypreload',
			errorClass: 'lazyerror',
			//strictClass: 'lazystrict',
			autosizesClass: 'lazyautosizes',
			srcAttr: 'data-src',
			srcsetAttr: 'data-srcset',
			sizesAttr: 'data-sizes',
			//preloadAfterLoad: false,
			minSize: 40,
			customMedia: {},
			init: true,
			expFactor: 1.5,
			hFac: 0.8,
			loadMode: 2
		};

		lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

		for(prop in lazySizesDefaults){
			if(!(prop in lazySizesConfig)){
				lazySizesConfig[prop] = lazySizesDefaults[prop];
			}
		}

		window.lazySizesConfig = lazySizesConfig;

		setTimeout(function(){
			if(lazySizesConfig.init){
				init();
			}
		});
	})();

	return {
		cfg: lazySizesConfig,
		autoSizer: autoSizer,
		loader: loader,
		init: init,
		uP: updatePolyfill,
		aC: addClass,
		rC: removeClass,
		hC: hasClass,
		fire: triggerEvent,
		gW: getWidth,
		rAF: rAF,
	};
}
));

/**
 * FF's first picture implementation is static and does not react to viewport changes, this tiny script fixes this.
 */
(function(window) {
	/*jshint eqnull:true */
	var ua = navigator.userAgent;

	if ( window.HTMLPictureElement && ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 41) ) {
		addEventListener("resize", (function() {
			var timer;

			var dummySrc = document.createElement("source");

			var fixRespimg = function(img) {
				var source, sizes;
				var picture = img.parentNode;

				if (picture.nodeName.toUpperCase() === "PICTURE") {
					source = dummySrc.cloneNode();

					picture.insertBefore(source, picture.firstElementChild);
					setTimeout(function() {
						picture.removeChild(source);
					});
				} else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
					img._pfLastSize = img.offsetWidth;
					sizes = img.sizes;
					img.sizes += ",100vw";
					setTimeout(function() {
						img.sizes = sizes;
					});
				}
			};

			var findPictureImgs = function() {
				var i;
				var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
				for (i = 0; i < imgs.length; i++) {
					fixRespimg(imgs[i]);
				}
			};
			var onResize = function() {
				clearTimeout(timer);
				timer = setTimeout(findPictureImgs, 99);
			};
			var mq = window.matchMedia && matchMedia("(orientation: landscape)");
			var init = function() {
				onResize();

				if (mq && mq.addListener) {
					mq.addListener(onResize);
				}
			};

			dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

			if (/^[c|i]|d$/.test(document.readyState || "")) {
				init();
			} else {
				document.addEventListener("DOMContentLoaded", init);
			}

			return onResize;
		})());
	}
})(window);

/*
This lazySizes extension adds better support for print.
In case the user starts to print lazysizes will load all images.
*/
(function(window){
	/*jshint eqnull:true */
	'use strict';
	var config, elements, onprint, printMedia;
	// see also: http://tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript/
	if(window.addEventListener){
		config = (window.lazySizes && lazySizes.cfg) || window.lazySizesConfig || {};
		elements = config.lazyClass || 'lazyload';
		onprint = function(){
			var i, len;
			if(typeof elements == 'string'){
				elements = document.getElementsByClassName(elements);
			}

			if(window.lazySizes){
				for(i = 0, len = elements.length; i < len; i++){
					lazySizes.loader.unveil(elements[i]);
				}
			}
		};

		addEventListener('beforeprint', onprint, false);

		if(!('onbeforeprint' in window) && window.matchMedia && (printMedia = matchMedia('print')) && printMedia.addListener){
			printMedia.addListener(function(){
				if(printMedia.matches){
					onprint();
				}
			});
		}
	}
})(window);

