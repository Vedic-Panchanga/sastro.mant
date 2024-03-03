#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <math.h>
#include "swephexp.h"
// hero_hacker
// http://bbs.nongli.net/dispbbs_2_71762_5_3.html
int jhour, jmin, jsec, tjd;
int jday = 1, jmon = 1, jyear = 2016;
int i = 0, j = 0, k = 0;
int gregflag = 0;
int iflag = 258;
char serr[AS_MAXCH];
// 月相: attr[1] = phase (illumined fraction of disc) change direction, increase to decrease
// YCH: 这是elongation的月相，可以遍历，也可以用三点法？
void moon_pheno()
{
    double dret[20];
    double jut, tjd_ut;
    int ord[3];

    int direct = 0;
    double buffer = 0;
    char buf[8000];
    char s[AS_MAXCH];

    double d_timezone = -8;
    int32 iyear_out, imonth_out, iday_out,
        ihour_out, imin_out;
    double dsec_out;
    strcpy(buf, "");
    // 获得日期
    int jday = 0;
    int jmon = 8;
    int jyear = 2000;
    int jhour = 8;
    int jmin = 0;
    int jsec = 0;
    int jut = jhour + jmin / 60.0 + jsec / 3600.0;
    tjd_ut = swe_julday(jyear, jmon, jday, jut, 0);
    int tjd = tjd_ut;

    // 遍历一个月
    for (i = 0; i < 31; i++)
    {
        swe_pheno(tjd, SE_MOON, 258, dret, serr);
        if (buffer != 0) // buffer记录之前的月相， 月相不为零的话对比，为零的话赋值
        {
            if (dret[1] >= buffer) // attr[1] = phase (illumined fraction of disc)
            {
                if (direct == -1) // 月相增加，direct变成正
                {
                    direct = 1; // 月相改变方向，跳出循环
                    break;
                }
                direct = 1;
            }
            else
            {
                if (direct == 1) // 月相减少，direct变成正
                {
                    direct = -1; // 月相改变方向，跳出循环
                    break;
                }
                direct = -1;
            }
        }
        buffer = dret[1]; // 月相没有改变方向，记录月相，继续循环
        tjd++;
    }
    k = i;         // k: 第几天满月或者朔
    tjd = tjd - 2; // 它的julian day，回退两天
    i = 0;
    buffer = 0;
    direct = 0;
    while (TRUE)
    {
        i++;
        tjd = tjd + (double)1 / 1440; // 在之前的时间之上，增加一分钟
        swe_pheno(tjd, SE_MOON, 258, dret, serr);
        if (buffer != 0) // 是否是第一天？
        {
            if (dret[1] >= buffer)
            {
                if (direct == -1)
                {
                    ord[j] = i - 1; // 拐点
                    j++;
                    swe_revjul(tjd, 0, &jyear, &jmon, &jday, &jut);
                    jut += 0.5 / 3600;
                    jhour = (int)jut;
                    jmin = (int)fmod(jut * 60, 60);
                    jsec = (int)fmod(jut * 3600, 60);
                    swe_utc_time_zone(
                        jyear, jmon, jday,
                        jhour, jmin, jsec,
                        d_timezone,
                        &iyear_out, &imonth_out, &iday_out,
                        &ihour_out, &imin_out, &dsec_out);
                    sprintf(s, "朔  %d.%d.%d - %02d:%02d\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out);
                    do_print(buf, s);
                    i = i + 20000;
                    tjd = tjd + (double)1 / 1440 * 20000;
                }
                direct = 1; // 上升
            }
            else
            {
                if (direct == 1)
                {
                    ord[j] = i - 1; // 拐点
                    j++;
                    swe_revjul(tjd, 0, &jyear, &jmon, &jday, &jut);
                    jut += 0.5 / 3600;
                    jhour = (int)jut;
                    jmin = (int)fmod(jut * 60, 60);
                    jsec = (int)fmod(jut * 3600, 60);
                    swe_utc_time_zone(
                        jyear, jmon, jday,
                        jhour, jmin, jsec,
                        d_timezone,
                        &iyear_out, &imonth_out, &iday_out,
                        &ihour_out, &imin_out, &dsec_out);
                    sprintf(s, "望  %d.%d.%d - %02d:%02d\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out);
                    do_print(buf, s);
                    i = i + 20000;
                    tjd = tjd + (double)1 / 1440 * 20000;
                }
                direct = -1; // 下降
            }
        }
        buffer = dret[1];                  // 不是第一天的话，赋值
        if ((k + i / 1440) > 33 || j == 3) // 历日超过33，或者已经找到三个满月和朔了
            break;
    }
}
/*
  attr[0] = 日地距角 (地-行星-太阳)
  attr[1] = 相 (圆盘被照亮的部分)
  attr[2] = 行星的距角
  attr[3] = 圆盘的视直径
  attr[4] = 视星等

*/

// 大距: pheno => attr[2] = elongation of planet. elongation increase to decrease or verse visa
void greatest_elongation()
{
    double dret[20];
    double jut, tjd_ut;
    int i = 0, j, k;
    int direct = 0;
    double buffer = 0;
    char buf[8000];
    char s[AS_MAXCH];
    double d_timezone = -8;
    int32 iyear_out, imonth_out, iday_out, ihour_out, imin_out;
    double dsec_out;
    int flag = 0;
    strcpy(buf, "");
    jday = 1;
    jmon = 1; // pd.mon;
    jyear = 2000;
    jhour = (int)d_timezone;
    jmin = 0;
    jsec = 0;
    jut = jhour + jmin / 60.0 + jsec / 3600.0;
    tjd_ut = swe_julday(jyear, jmon, jday, jut, gregflag);
    tjd = tjd_ut;
    //  SE_MERCURY      2  水星
    for (i = 0; i < 365; i++)
    {
        swe_pheno(tjd, SE_MERCURY, iflag, dret, serr);
        if (buffer != 0) // 如果不是第一天
        {
            flag = 0;
            if (dret[2] >= buffer) // 上升 attr[2] = elongation of planet. elongation increase
            {
                if (direct == -1)
                {
                    flag = 1; // if it was retro, then we found one greatest.
                }
                direct = 1; // mark it direct
            }
            else if (dret[2]) // elongation decrease, but not 0
            {
                if (direct == 1)
                {
                    flag = 2; // if it was direct, then we found one greatest.
                }
                direct = -1; // mark it retro
            }
            if (dret[2] > 15 && flag >= 1)
            {
                tjd = tjd - 1; // 回退一天，然后遍历一天
                buffer = 0;
                for (j = 0; j < 24; j++)
                {
                    tjd = tjd + (double)1 / 24;
                    swe_pheno(tjd, SE_MERCURY, iflag, dret, serr);
                    if (dret[2])
                    {
                        buffer = dret[2];
                        break;
                    }
                    buffer = dret[2];
                }
                tjd = tjd - (double)1 / 24; // 回退一个小时，然后遍历这个小时
                for (k = 0; k < 60; k++)
                {
                    tjd = tjd + (double)1 / 1440;
                    swe_pheno(tjd, SE_MERCURY, iflag, dret, serr);
                    if (dret[2])
                    {
                        buffer = dret[2];
                        break;
                    }
                    buffer = dret[2];
                }
                swe_revjul(tjd, gregflag, &jyear, &jmon, &jday, &jut);
                jut += 0.5 / 3600;
                jhour = (int)jut;
                jmin = (int)fmod(jut * 60, 60);
                jsec = (int)fmod(jut * 3600, 60);
                swe_utc_time_zone(
                    jyear, jmon, jday,
                    jhour, jmin, jsec,
                    d_timezone,
                    &iyear_out, &imonth_out, &iday_out,
                    &ihour_out, &imin_out, &dsec_out);
                sprintf(s, "水星大距  %d.%d.%d - %02d:%02d\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out);
                do_print(buf, s);
                buffer = 0;
                direct = 0;
                tjd = swe_julday(jyear, jmon, jday, jut, gregflag);
            }
        }
        buffer = dret[2];
        tjd++;
    }
}
// 例三 木星合月的测试计算: calc Moon calc Jupiter=> y = fabs(x_moon[0]-x_jupiter[0]) increase
// YCH: 这里是ecliptic的合，根本不应该遍历，有速度差那直接截线法
int Conjunction()
{
    double jut = 0.0;
    double tjd_ut, x[6], x1, x2, y;
    long iflag, iflgret;
    double d_timezone = -8;
    char buf[8000];
    char s[AS_MAXCH];
    int direct = 0;
    double buffer = 0;
    int32 iyear_out, imonth_out, iday_out, ihour_out, imin_out;
    double dsec_out;
    int flag = 0, j, k;
    jyear = 2000;
    strcpy(buf, "");
    swe_set_ephe_path(NULL);
    iflag = SEFLG_SPEED;

    // 年月日转换为儒略日数
    tjd_ut = swe_julday(jyear, jmon, jday, d_timezone, SE_GREG_CAL);
    tjd_ut--;
    for (i = 0; i <= 365; i++)
    {
        iflgret = swe_calc_ut(tjd_ut, SE_JUPITER, iflag, x, serr);
        x1 = swe_degnorm(x[0]);
        iflgret = swe_calc_ut(tjd_ut, SE_MOON, iflag, x, serr);
        x2 = swe_degnorm(x[0]);
        y = fabs(x2 - x1);
        if (y >= buffer && buffer != 0) // 当前值大于上一次的值。取用上一次的时间
        {
            tjd_ut -= 1; // 回退一天 0.412155
            flag = 0;
            buffer = 0;
            for (j = 0; j <= 24; j++) // 小时计算
            {
                iflgret = swe_calc_ut(tjd_ut, SE_JUPITER, iflag, x, serr);
                x1 = swe_degnorm(x[0]);
                iflgret = swe_calc_ut(tjd_ut, SE_MOON, iflag, x, serr);
                x2 = swe_degnorm(x[0]);
                y = fabs(x2 - x1);
                if (y >= buffer && buffer != 0) //
                {
                    buffer = 0;
                    tjd_ut -= (double)2 / 24; // 回退一小时  0.083471
                    flag = 0;
                    for (k = 0; k <= 60; k++) // 分计算
                    {
                        iflgret = swe_calc_ut(tjd_ut, SE_JUPITER, iflag, x, serr);
                        x1 = swe_degnorm(x[0]);
                        iflgret = swe_calc_ut(tjd_ut, SE_MOON, iflag, x, serr);
                        x2 = swe_degnorm(x[0]);
                        y = fabs(x2 - x1);
                        if (y >= buffer && buffer != 0) // 上升
                        {
                            swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
                            jut += 0.5 / 3600;
                            jhour = (int)jut;
                            jmin = (int)fmod(jut * 60, 60);
                            jsec = (int)fmod(jut * 3600, 60);
                            swe_utc_time_zone(
                                jyear, jmon, jday,
                                jhour, jmin, jsec,
                                d_timezone,
                                &iyear_out, &imonth_out, &iday_out,
                                &ihour_out, &imin_out, &dsec_out);
                            sprintf(s, "木星合月  %d.%d.%d - %02d:%02d\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out);
                            do_print(buf, s);
                            flag = 0;
                            buffer = 0;
                            direct = 0;
                            i = i + 27;
                            tjd_ut = swe_julday(jyear, jmon, jday + 27, d_timezone, SE_GREG_CAL);
                            goto out;
                        }
                        tjd_ut = tjd_ut + (double)1 / 1440;
                        buffer = y;
                    }
                }
                tjd_ut += (double)1 / 24;
                buffer = y;
            }
        }
    out:
        tjd_ut += 1;
        buffer = y;
    }
    return OK;
}
// 例四 水星“留”的计算: calc=> x[3] changes sign
// YCH: 这里是ecliptic的留，根本不应该遍历，有速度那么，根据速度来做判断（速度接近于0）
void retention()
{
    double jut = 0.0;
    double tjd_ut, x[6];
    long iflag, iflgret;
    double d_timezone = -8;
    char buf[8000];
    char s[AS_MAXCH];
    int direct = 0;
    double buffer = 0;
    int32 iyear_out, imonth_out, iday_out, ihour_out, imin_out;
    double dsec_out;
    int flag = 0, j, k;
    jyear = 2000;
    strcpy(buf, "");
    swe_set_ephe_path(NULL);
    iflag = SEFLG_SPEED;

    // 年月日转换为儒略日数
    tjd_ut = swe_julday(jyear, jmon, jday, d_timezone, SE_GREG_CAL);
    tjd_ut--;

    for (i = 0; i <= 365; i++)

    {
        iflgret = swe_calc(tjd_ut, SE_MERCURY, iflag, x, serr);
        if (buffer != 0)
        {
            flag = 0;
            if (x[3] >= buffer) // 上升
            {
                if (x[3] > 0 && buffer < 0)
                    flag = 1;
            }
            else if (x[3])
            {
                if (buffer >= 0 && x[3] < 0)
                    flag = 2;
            }
            if (flag >= 1)
            {
                tjd_ut -= 1; // 回退一天 0.412155
                flag = 0;
                buffer = 0;
                for (j = 0; j <= 24; j++) // 小时计算
                {
                    iflgret = swe_calc(tjd_ut, SE_MERCURY, iflag, x, serr);
                    if ((buffer > 0 && x[3] < 0) || (buffer < 0 && x[3] > 0)) //
                    {
                        buffer = 0;
                        tjd_ut -= (double)2 / 24; // 回退一小时  0.083471
                        flag = 0;
                        for (k = 0; k <= 120; k++) // 分计算
                        {
                            iflgret = swe_calc(tjd_ut, SE_MERCURY, iflag, x, serr);
                            if ((buffer > 0 && x[3] < 0) || (buffer < 0 && x[3] > 0)) // 上升
                            {
                                swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
                                jut += 0.5 / 3600;
                                jhour = (int)jut;
                                jmin = (int)fmod(jut * 60, 60);
                                jsec = (int)fmod(jut * 3600, 60);
                                swe_utc_time_zone(
                                    jyear, jmon, jday,
                                    jhour, jmin, jsec,
                                    d_timezone,
                                    &iyear_out, &imonth_out, &iday_out,
                                    &ihour_out, &imin_out, &dsec_out);
                                sprintf(s, "水星留  %d.%d.%d - %02d:%02d\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out);
                                // sprintf(s, "水星留  %d.%d.%d - %02d:%02d\r\n", jyear, jmon, jday,jhour, jmin);
                                do_print(buf, s);
                                flag = 0;
                                buffer = 0;
                                direct = 0;
                                i = i + 19;
                                tjd_ut = swe_julday(jyear, jmon, jday + 19, d_timezone, SE_GREG_CAL);
                                goto out;
                            }
                            tjd_ut = tjd_ut + (double)1 / 1440;
                            buffer = x[3];
                        }
                    }
                    tjd_ut += (double)1 / 24;
                    buffer = x[3];
                }
            }
        }
        tjd_ut += 1;
        buffer = x[3];
    out:;
    }
}
// 例五 土星冲日
// SE_SATURN
/*
土星冲日是指土星、地球、太阳三者依次排成一条直线，
也就是土星与太阳黄经相差180度的现象，天文学上称为“土星冲日”。
YCH: 这是黄经的冲，用了calc, 不应该遍历，有速度直接用速度
*/
int opposition()
{
    double jut = 0.0;
    double tjd_ut, x[6], x1, x2, y;
    long iflag, iflgret;
    double d_timezone = -8;
    char buf[8000];
    char s[AS_MAXCH];
    int direct = 0;
    double buffer = 0;
    int flag = 0, j, k;
    jyear = 2000;
    strcpy(buf, "");
    swe_set_ephe_path(NULL);
    iflag = SEFLG_SPEED;
    tjd_ut = swe_julday(jyear, jmon, jday, d_timezone, SE_GREG_CAL);
    tjd_ut--;
    for (i = 0; i <= 365; i++)
    {
        iflgret = swe_calc(tjd_ut, SE_SATURN, iflag, x, serr);
        x1 = swe_degnorm(x[0]);
        iflgret = swe_calc(tjd_ut, SE_SUN, iflag, x, serr);
        x2 = swe_degnorm(x[0]);
        y = fabs(fabs(x2 - x1) - 180);
        if (y >= buffer && buffer != 0 && y < 2)
        {
            tjd_ut -= 2;
            flag = 0;
            buffer = 0;
            for (j = 0; j <= 24; j++)
            {
                iflgret = swe_calc(tjd_ut, SE_SATURN, iflag, x, serr);
                x1 = swe_degnorm(x[0]);
                iflgret = swe_calc(tjd_ut, SE_SUN, iflag, x, serr);
                x2 = swe_degnorm(x[0]);
                y = fabs(fabs(x2 - x1) - 180);
                if (y >= buffer && buffer != 0)
                {
                    buffer = 0;
                    tjd_ut -= (double)2 / 24;
                    flag = 0;
                    for (k = 0; k <= 60; k++)
                    {
                        iflgret = swe_calc(tjd_ut, SE_SATURN, iflag, x, serr);
                        x1 = swe_degnorm(x[0]);
                        iflgret = swe_calc(tjd_ut, SE_SUN, iflag, x, serr);
                        x2 = swe_degnorm(x[0]);
                        y = fabs(fabs(x2 - x1) - 180);
                        if (y >= buffer && buffer != 0)
                        {
                            swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
                            jut += 0.5 / 3600;
                            jhour = (int)jut;
                            jmin = (int)fmod(jut * 60, 60);
                            jsec = (int)fmod(jut * 3600, 60);
                            sprintf(s, "土星冲日  %d.%d.%d - %02d:%02d\r\n", jyear, jmon, jday, jhour, jmin);
                            do_print(buf, s);
                            flag = 0;
                            buffer = 0;
                            direct = 0;
                            i = i + 3;
                            tjd_ut = swe_julday(jyear, jmon, jday + 3, d_timezone, SE_GREG_CAL);
                            goto out;
                        }
                        tjd_ut = tjd_ut + (double)1 / 1440;
                        buffer = y;
                    }
                }
                tjd_ut += (double)1 / 24;
                buffer = y;
            }
        }
        tjd_ut += 1;
        buffer = y;
    out:;
    }
    return OK;
}
// 例六 土星方照
// YCH: 这是黄经的刑，用了calc, 不应该遍历，有速度直接用速度
void quadrature()
{
    double jut = 0.0;
    double tjd_ut, x[6], x1, x2, y;
    long iflag, iflgret;
    double d_timezone = -8;
    char buf[8000];
    char s[AS_MAXCH];
    int direct = 0;
    double buffer = 0;
    int flag = 0, j, k;
    strcpy(buf, "");
    swe_set_ephe_path(NULL);
    iflag = SEFLG_SPEED;
    tjd_ut = swe_julday(jyear, jmon, jday, d_timezone, SE_GREG_CAL);
    tjd_ut--;
    for (i = 0; i <= 365; i++)
    {
        iflgret = swe_calc(tjd_ut, SE_SATURN, iflag, x, serr);
        x1 = swe_degnorm(x[0]);
        iflgret = swe_calc(tjd_ut, SE_SUN, iflag, x, serr);
        x2 = swe_degnorm(x[0]);
        y = fabs(fabs(x2 - x1) - 90);
        if (y >= buffer && buffer != 0 && y < 2)
        {
            tjd_ut -= 2;
            flag = 0;
            buffer = 0;
            for (j = 0; j <= 24; j++)
            {
                iflgret = swe_calc(tjd_ut, SE_SATURN, iflag, x, serr);
                x1 = swe_degnorm(x[0]);
                iflgret = swe_calc(tjd_ut, SE_SUN, iflag, x, serr);
                x2 = swe_degnorm(x[0]);
                y = fabs(fabs(x2 - x1) - 90);
                if (y >= buffer && buffer != 0)
                {
                    buffer = 0;
                    tjd_ut -= (double)2 / 24;
                    flag = 0;
                    for (k = 0; k <= 60; k++)
                    {
                        iflgret = swe_calc(tjd_ut, SE_SATURN, iflag, x, serr);
                        x1 = swe_degnorm(x[0]);
                        iflgret = swe_calc(tjd_ut, SE_SUN, iflag, x, serr);
                        x2 = swe_degnorm(x[0]);
                        y = fabs(fabs(x2 - x1) - 90);
                        if (y >= buffer && buffer != 0)
                        {
                            swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
                            jut += 0.5 / 3600;
                            jhour = (int)jut;
                            jmin = (int)fmod(jut * 60, 60);
                            jsec = (int)fmod(jut * 3600, 60);
                            sprintf(s, "土星方照  %d.%d.%d - %02d:%02d\r\n", jyear, jmon, jday, jhour, jmin);
                            do_print(buf, s);
                            flag = 0;
                            buffer = 0;
                            direct = 0;
                            i = i + 3;
                            tjd_ut = swe_julday(jyear, jmon, jday + 3, d_timezone, SE_GREG_CAL);
                            goto out;
                        }
                        tjd_ut = tjd_ut + (double)1 / 1440;
                        buffer = y;
                    }
                }
                tjd_ut += (double)1 / 24;
                buffer = y;
            }
        }
        tjd_ut += 1;
        buffer = y;
    out:;
    }
    return;
}
// 例七 月过近地点、远地点时间计算: swe_calc => x[2] 增加变成减少
// YCH: 有速度可以直接二分法，看速度什么时候趋近于0？
void Apogee_Perigee()
{
    double jut = 0.0;
    double tjd_ut, x[6], x1, x2, x0;
    long iflag, iflgret;
    double d_timezone = -8;
    char buf[8000];
    char s[AS_MAXCH];
    int direct = 0;
    double buffer = 0;
    int32 iyear_out, imonth_out, iday_out, ihour_out, imin_out;
    double dsec_out;
    int flag = 0, a;
    strcpy(buf, "");
    swe_set_ephe_path(NULL);
    iflag = SEFLG_SPEED;
    // 年月日转换为儒略日数
    tjd_ut = swe_julday(jyear, jmon, jday, d_timezone, SE_GREG_CAL);
    tjd_ut--;
    while (TRUE)
    {
        swe_calc(tjd_ut - (double)1 / 1440, SE_MOON, iflag, x, serr);
        x0 = x[2];
        iflgret = swe_calc(tjd_ut, SE_MOON, iflag, x, serr);
        x1 = x[2];
        iflgret = swe_calc(tjd_ut + (double)1 / 1440, SE_MOON, iflag, x, serr);
        x2 = x[2];
        flag = 0;
        if (x1 > x0 && x1 > x2)
            flag = 1;
        if (x1)
            flag = 2;
        if (flag >= 1)
        {
            swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
            jut += 0.5 / 3600;
            jhour = (int)jut;
            jmin = (int)fmod(jut * 60, 60);
            jsec = (int)fmod(jut * 3600, 60);
            swe_utc_time_zone(
                jyear, jmon, jday,
                jhour, jmin, jsec,
                d_timezone,
                &iyear_out, &imonth_out, &iday_out,
                &ihour_out, &imin_out, &dsec_out);
            if (jyear > 2000)
                break;
            a = (x1 * 149597870700) / 1000;
            if (a > 400000)
                sprintf(s, "月球过远地点  %d.%d.%d - %02d:%02d %dkm\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out, a);
            else
                sprintf(s, "月球过近地点  %d.%d.%d - %02d:%02d %dkm\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out, a);
            do_print(buf, s);
            tjd_ut = swe_julday(jyear, jmon, jday + 12, d_timezone, SE_GREG_CAL);
        }
        tjd_ut += (double)1 / 1440;
    }
    return;
}
// 例八 月过赤纬点计算: calc with SEFLG_EQUATORIAL
// YCH: 遍历 x[1]极值，用speed趋近于0更好?
void declination()
{
    double jut = 0.0;
    double tjd_ut, x[6], x1, x2, x0;
    long iflag, iflgret;
    double d_timezone = -8;
    char buf[8000];
    char s[AS_MAXCH];
    int direct = 0;
    double buffer = 0;
    int32 iyear_out, imonth_out, iday_out, ihour_out, imin_out;
    double dsec_out;
    int flag = 0;
    strcpy(buf, "");
    swe_set_ephe_path(NULL);
    iflag = SEFLG_SPEED;

    // 年月日转换为儒略日数
    tjd_ut = swe_julday(jyear, jmon, jday, d_timezone, SE_GREG_CAL);
    tjd_ut--;
    while (TRUE)
    {
        swe_calc(tjd_ut - (double)1 / 1440, SE_MOON, iflag | SEFLG_EQUATORIAL, x, serr);
        x0 = x[1];
        iflgret = swe_calc(tjd_ut, SE_MOON, iflag | SEFLG_EQUATORIAL, x, serr);
        x1 = x[1];
        iflgret = swe_calc(tjd_ut + (double)1 / 1440, SE_MOON, iflag | SEFLG_EQUATORIAL, x, serr);
        x2 = x[1];
        flag = 0;
        if (x1 > x0 && x1 > x2)
            flag = 1;
        if (x1)
            flag = 2;
        if (flag >= 1)
        {
            swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
            jut += 0.5 / 3600;
            jhour = (int)jut;
            jmin = (int)fmod(jut * 60, 60);
            jsec = (int)fmod(jut * 3600, 60);
            swe_utc_time_zone(
                jyear, jmon, jday,
                jhour, jmin, jsec,
                d_timezone,
                &iyear_out, &imonth_out, &iday_out,
                &ihour_out, &imin_out, &dsec_out);
            if (jyear > 2000)
                break;
            if (x[1] > 0)
                sprintf(s, "月过赤纬北点  %d.%d.%d - %02d:%02d %f°\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out, x[1]);
            else
                sprintf(s, "月过赤纬南点  %d.%d.%d - %02d:%02d %f°\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out, x[1]);
            do_print(buf, s);
            tjd_ut = swe_julday(jyear, jmon, jday + 10, d_timezone, SE_GREG_CAL);
        }
        tjd_ut += (double)1 / 1440;
    }
}
// 例九 地球的近日点远日点计算: calc SE_SUN
// YCH: 遍历 x[2]极值，用speed趋近于0更好?
void perihelion_aphelion()
{
    double jut = 0.0;
    double tjd_ut, x[6], x1, x2, x0;
    long iflag, iflgret;
    double d_timezone = -8;
    char buf[8000];
    char s[AS_MAXCH];
    int direct = 0;
    double buffer = 0;
    int32 iyear_out, imonth_out, iday_out, ihour_out, imin_out;
    double dsec_out;
    int flag = 0;
    strcpy(buf, "");
    swe_set_ephe_path(NULL);
    iflag = SEFLG_SPEED;
    // 年月日转换为儒略日数
    tjd_ut = swe_julday(jyear, jmon, jday, d_timezone, SE_GREG_CAL);
    tjd_ut--;
    while (TRUE)
    {
        swe_calc(tjd_ut - (double)1 / 1440, SE_SUN, iflag, x, serr);
        x0 = x[2];
        iflgret = swe_calc(tjd_ut, SE_SUN, iflag, x, serr);
        x1 = x[2];
        iflgret = swe_calc(tjd_ut + (double)1 / 1440, SE_SUN, iflag, x, serr);
        x2 = x[2];
        flag = 0;
        if (x1 > x0 && x1 > x2)
            flag = 1;
        if (x1)
            flag = 2;
        if (flag >= 1)
        {
            swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
            jut += 0.5 / 3600;
            jhour = (int)jut;
            jmin = (int)fmod(jut * 60, 60);
            jsec = (int)fmod(jut * 3600, 60);
            swe_ut_time_zone(
                jyear, jmon, jday,
                jhour, jmin, jsec,
                d_timezone,
                &iyear_out, &imonth_out, &iday_out,
                &ihour_out, &imin_out, &dsec_out);
            if (jyear > 2000)
                break;
            if (jmon == 1)
                sprintf(s, "地球过近日点  %d.%d.%d - %02d:%02d %fau\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out, x[2]);
            else
                sprintf(s, "地球过远日点  %d.%d.%d - %02d:%02d %fau\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out, x[2]);
            do_print(buf, s);
            tjd_ut = swe_julday(jyear, jmon, jday + 160, d_timezone, SE_GREG_CAL);
        }
        tjd_ut += (double)1 / 1440;
    }
    return;
}
// 例十 月亮过升交点、降交点: 遍历swe_calc(tjd_ut, SE_MOON, iflag, x, serr);看x[1]换方向
/*
月球交点是月球的轨道交点，它是月球轨道在天球上穿越过黄道（太阳在以恒星为背景的天球上移动的路径）的位置。
升交点是月球穿越黄道进入北方的点，降交点是穿越黄道进入南方的点。
当月亮经过升交点或者降交点时 其地心黄纬为零。
YCH: 有速度，用牛顿法
*/
void moon_node()
{
    double jut = 0.0;
    double tjd_ut, x[6], x1, x2, x0;
    long iflag = SEFLG_SPEED;
    double d_timezone = -8;
    char buf[8000];
    char s[AS_MAXCH];
    int32 iyear_out, imonth_out, iday_out, ihour_out, imin_out;
    double dsec_out;
    int flag = 0;
    strcpy(buf, "");
    swe_set_ephe_path(NULL);
    // 年月日转换为儒略日数
    tjd_ut = swe_julday(jyear, jmon, jday, d_timezone, SE_GREG_CAL);
    tjd_ut--;
    while (TRUE)
    {
        swe_calc(tjd_ut - (double)1 / 1440, SE_MOON, iflag, x, serr);
        x0 = x[1];
        swe_calc(tjd_ut, SE_MOON, iflag, x, serr);
        x1 = x[1];
        swe_calc(tjd_ut + (double)1 / 1440, SE_MOON, iflag, x, serr);
        x2 = x[1];
        flag = 0;
        if ((x1 > 0 && x0 < 0) || (x1 < 0 && x0 > 0))
            flag = 1;
        swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
        if (jyear > 2000)
            break;
        if (flag >= 1)
        {
            swe_revjul(tjd_ut, gregflag, &jyear, &jmon, &jday, &jut);
            jut += 0.5 / 3600;
            jhour = (int)jut;
            jmin = (int)fmod(jut * 60, 60);
            jsec = (int)fmod(jut * 3600, 60);
            swe_utc_time_zone(
                jyear, jmon, jday,
                jhour, jmin, jsec,
                d_timezone,
                &iyear_out, &imonth_out, &iday_out,
                &ihour_out, &imin_out, &dsec_out);
            if (jyear > 2000)
                break;
            if (x1)
                sprintf(s, "月过降交点  %d.%d.%d - %02d:%02d\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out);
            else
                sprintf(s, "月过升交点  %d.%d.%d - %02d:%02d\r\n", iyear_out, imonth_out, iday_out, ihour_out, imin_out);
            do_print(buf, s);
            tjd_ut = swe_julday(jyear, jmon, jday + 13, d_timezone, SE_GREG_CAL);
        }
        tjd_ut += (double)1 / 1440;
    }
    return;
}